import { useAuth } from "./hooks/useAuth";
import Loading from "./components/Loading";
import AppRouter from "./router";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
          },
        }}
      />
      <AppRouter />
    </>
  );
};

export default App;
