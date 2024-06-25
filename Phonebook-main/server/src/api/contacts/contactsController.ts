import express, { Request, Response } from "express";
import { Contact } from "../../models/contact.model";
import { User } from "../../models/user.model";
import { requireAuth } from "../../middleware/requireAuth";
import { IAuthRequest } from "../../interfaces/authRequest";
import multer from "multer";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import { IContact, IPhoneNumber } from "../../interfaces/contact";
import { IContactResponse } from "../models/contactResponse";
import dotenv from "dotenv";

const router = express.Router();

dotenv.config();

const serverUrl = process.env.SERVER_URL || '';
const appRootPath = path.resolve(__dirname, '..', '..');

const upload = multer({ dest: appRootPath + "/uploads/"});

router.post("/", requireAuth, upload.single("pictureFile"), async (req: IAuthRequest, res: Response) => {
    try {
        // TODO: Validate the request body
        const { firstName, lastName, phoneNumbers, address } = req.body;

        const phoneNumbersArray = JSON.parse(phoneNumbers) as IPhoneNumber[] | null;

        if (!firstName || phoneNumbersArray?.length === 0) {
            res.status(400).send("You need to specify first name and one phone number to create a contact!")
        }

        const newContact = new Contact({
            firstName,
            lastName,
            phoneNumbers: phoneNumbersArray,
            address,
            user: req.user,
        });

        await newContact.save();
                
        const photoFilePath = getPhotoFilesPath(req.userId!);

        if (req.file) {            
            const savedImageName = saveContactPicture(req.file, req.userId!, newContact);

            if (savedImageName) {
                newContact.picture = savedImageName;
                await newContact.save();
            }
        }

        res.status(201).json({ contact: mapContact(newContact) });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

router.get("/:id", requireAuth, async (req: IAuthRequest, res: Response) => {
    try {
        const contactId = req.params.id;

        const contact = await Contact.findById(contactId);
        if (!contact || contact.user?._id.toString() !== req.userId) {
            return res.status(403).send("You are not authorized to update this contact.");
        }

        res.json({ contact: contact });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

router.get("/", requireAuth, async (req: IAuthRequest, res: Response) => {
    try {
        const contacts = await Contact.find({user: req.userId});

        res.json({ contacts: contacts.map(mapContact) });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

router.put("/:id", requireAuth, upload.single('pictureFile'), async (req: IAuthRequest, res: Response) => {
    try {
        const contactId = req.params.id;

        const { firstName, lastName, deletePicture, phoneNumbers, address } = req.body;

        const phoneNumbersArray = JSON.parse(phoneNumbers) as IPhoneNumber[] | null;
        if (!firstName || !phoneNumbersArray || phoneNumbersArray?.length === 0) {
            res.status(400).send("You need to specify first name and one phone number to update a contact!")
            return;
        }

        const contact = await Contact.findById(contactId);
        if (!contact || contact.user?._id.toString() !== req.userId) {
            return res.status(403).send("You are not authorized to update this contact.");
        }
        
        contact.firstName = firstName;
        contact.lastName = lastName;
        contact.phoneNumbers = phoneNumbersArray;
        contact.address = address;

        if (deletePicture || req.file) {
            if (contact.picture) {
                const photoFilesPath = getPhotoFilesPath(req.userId!);
                const pictureFilePath = path.join(photoFilesPath, contact.picture);
                if (fs.existsSync(pictureFilePath)) {
                    fs.rmSync(pictureFilePath, { recursive: true });
                }
            }
            contact.picture = null;
        }

        if (req.file) {
            const savedImageName = saveContactPicture(req.file, req.userId!, contact);
            if (savedImageName) {
                contact.picture = savedImageName;
            }
        }
        
        await contact.save();

        res.json({ contact: mapContact(contact) });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

router.delete("/:id", requireAuth, async (req: IAuthRequest, res: Response) => {
    try {
        const contactId = req.params.id;

        const contact = await Contact.findById(contactId);
        if (!contact || contact.user?._id.toString() !== req.userId) {
            return res.status(403).send("You are not authorized to delete this contact.");
        }

        const pictureFileName = contact.picture;

        await contact.deleteOne();

        if (pictureFileName) {
            const photoFilePath = getPhotoFilesPath(req.userId!);
            const pictureFilePath = path.join(photoFilePath, pictureFileName);
            if (fs.existsSync(pictureFilePath)) {
                fs.rmSync(pictureFilePath, { recursive: true });
            }
        }

        res.json({ message: "Contact deleted successfully." });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


function getPhotoFilesPath(userId: string) {
    return path.join(appRootPath, 'content', 'photos', userId);
}

function saveContactPicture(file: Express.Multer.File, userId: string, contact: IContact) : string | null {
    const photoFilesPath = getPhotoFilesPath(userId);

    const uploadedFilename = file.path;

    const imageExtension = mime.extension(file.mimetype);
    let imageName = `${crypto.randomUUID()}.${imageExtension}`;
    while (fs.existsSync(path.join(photoFilesPath, imageName))) {
        imageName = `${crypto.randomUUID()}.${imageExtension}`;
    }

    const newFilePath = path.join(photoFilesPath, imageName);

    if (!fs.existsSync(photoFilesPath)) {
        fs.mkdirSync(photoFilesPath, { recursive: true });
    }

    let savedSuccessfully = true;
    fs.rename(uploadedFilename, newFilePath, (err) => {
        if (err) {
            console.log(err);
            savedSuccessfully = false;
        }
    });

    if (savedSuccessfully) {
        return imageName;
    } else {
        return null;
    }
}

function mapContact(contact: IContact): IContactResponse {
    return {
        _id: contact._id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phoneNumbers: contact.phoneNumbers.map(pn => ({ type: pn.type, number: pn.number })),
        address: contact.address,
        picture: contact.picture,
        pictureUrl: contact.picture && contact.user ? `${serverUrl}/content/photos/${contact.user._id.toString()}/${encodeURI(contact.picture)}` : null,
    }
}

export default router;

// PUT /merge/:id1/:id2
router.put("/merge/:id1/:id2", requireAuth, async (req: IAuthRequest, res: Response) => {
    try {
        const { id1, id2 } = req.params;

        // Find the contacts by their IDs and validate user ownership
        const contact1 = await Contact.findById(id1);
        const contact2 = await Contact.findById(id2);
        
        if (!contact1 || !contact2) {
            return res.status(404).send("Contacts not found.");
        }

        if (contact1.user?._id.toString() !== req.userId || contact2.user?._id.toString() !== req.userId) {
            return res.status(403).send("You are not authorized to merge these contacts.");
        }

        // Merge logic (example: combine fields, update references)
        // Example: merge phoneNumbers
        const mergedPhoneNumbers = [...contact1.phoneNumbers, ...contact2.phoneNumbers];
        // Ensure no duplicates (implement your logic based on your use case)

        // Update contact1 with merged data
        contact1.phoneNumbers = mergedPhoneNumbers;
        await contact1.save();

        // Remove contact2
        await contact2.deleteOne();

        // Return success message or updated contact1
        res.json({ message: "Contacts merged successfully.", contact: mapContact(contact1) });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// GET /search?q=:query
router.get("/search", requireAuth, async (req: IAuthRequest, res: Response) => {
    try {
        const query = req.query.q?.toString() || "";

        // Perform a search query (example: search by firstName and lastName)
        const searchResults = await Contact.find({
            $or: [
                { firstName: { $regex: query, $options: "i" } }, // Case-insensitive search
                { lastName: { $regex: query, $options: "i" } }
            ],
            user: req.userId // Ensure results belong to the authenticated user
        });

        // Return the search results
        res.json({ contacts: searchResults.map(mapContact) });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});