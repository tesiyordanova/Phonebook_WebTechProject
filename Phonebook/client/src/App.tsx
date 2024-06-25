import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import { useAppDispatch } from './store/hooks';
import { initUser, selectUser, login } from './store/features/userSlice';
import { useAppSelector } from './store/hooks';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initUser());
  }, [dispatch]);

  let user = useAppSelector(selectUser);

  return (
    <>
      {user && (
        <RouterProvider router={routes} />
      )}
    </>
  );
}

export default App;
