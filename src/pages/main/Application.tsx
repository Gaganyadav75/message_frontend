import toast, { Toaster } from "react-hot-toast";
import { lazy, Suspense, useEffect, useState } from "react";
import SingleTabGuard from "../../components/reusable/BroadCastGuard";
import { AppDispatch, useAppSelector } from "../../redux/store";
const MainPage = lazy(()=>import('./MainPage'));
const Sign = lazy(()=> import('../sign/Sign'));
import { useDispatch } from "react-redux";
import { AuthToken, EmailVerify } from "../../redux/slice/user/verify";
import { SocketProvider } from "../../handlers/socket/SocketContext";
import { ResetSucessError } from "../../redux/slice/user/mainAuth";
import { ChangeSignTab } from "../../redux/slice/other/tabs";
import LoadingComponent from "../../components/reusable/Loading";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const URLBck = import.meta.env.VITE_BACKEND_URL;

export const navigate = (to: string, alrt: boolean | string) => {
  window.location.href = to;
  if (alrt) {
    alert(alrt);
  }
};

export const reload = () => {
  window.location.reload();
};

function Applcation() {
  const auth = useAppSelector((state) => state.auth);
  const { user, logout, error, success } = auth;

  const [query, setQuery] = useState<{ email: string; token: string } | null>(
    null,
  );
  const [loggedin, setloggedin] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";
    const islogged = localStorage.getItem("logged");
    setloggedin(islogged ? true : false);
    setQuery({ email, token });
  }, []);

  useEffect(() => {
    if (!logout && !user && !query?.token && loggedin) {
      dispatch(AuthToken());
    } else if (query?.token) {
      dispatch(EmailVerify(query.token));
    }
  }, [dispatch, user, loggedin, query, logout]);

  useEffect(() => {
    if (error && !success) {
      toast.error(error || "something went wrong!");
      if (error == "Email verification pending")
        dispatch(ChangeSignTab("resend"));
      dispatch(ResetSucessError());
    } else if (success && !error) {
      toast.success(success);
      dispatch(ResetSucessError());
    }
  }, [dispatch,error, success, auth]);

  const dark = useAppSelector((state) => state.tabs.darkmode);

  return (
      <div
        className={`flex flex-col h-[100svh] w-[100svw] no-scrollbar relative ${
          dark ? "dark" : ""
        }`}
      >
        {user ? (
          <SocketProvider>
            <Suspense fallback={<LoadingComponent/>}>
              <MainPage />
            </Suspense>
          </SocketProvider>
        ) : (
          <Suspense fallback={<LoadingComponent/>}>
            <Sign />
          </Suspense>
        )}

        <SingleTabGuard />
        <Toaster position="top-center" reverseOrder={false} />
      </div>
  );
}

export default Applcation;
