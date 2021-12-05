import "styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { userService } from "services";
import style from "component/Component.module.scss";
import { Alert } from 'component/Alert';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };

  }, []);

  const authCheck = async (url: string) => {
    // redirect to login page if accessing a private page and not logged in
    // setUser(userService.userValue);
    // const publicPaths = ["/" ,"/login", "/sign-up", "/update-profile" ,"/forgot-password"];
    const path = url.split("?")[0];
    const notAuthorizedPath = ['/login/', "/sign-up", "/sign-up/", '/forgot-password/', 'help-screen/','/forgotpassword/','/sigupconfirm/'];
    const authorizedPath = ["/request/detail/", "/request/","/update-profile/", "/update-password/", "/organizations/add/", "/organizations/", "/volunteers/add/", "/volunteers/", '/add-camp/'];
    const publicPaths: any[] = [] ;

    if (publicPaths.includes(path)) {
      setAuthorized(true);
      return;
    }

    if (!userService.userValue) {
      // user not login
      if (authorizedPath.includes(path)) {
        // user must login
        setAuthorized(false);
        router.push({
          pathname: "/login",
          query: { returnUrl: router.asPath },
        });
        return;
      }
    } else {
      // user login
      if (notAuthorizedPath.includes(path)) {
        // redirect to home page
        setAuthorized(false);
        router.push({
          pathname: "/",
        });
        return;
      }
      await userService.getProfile();
    }
    setAuthorized(true);
  };
  return (
    <>
      <Head>
        <title>OutreachApp</title>
        <meta name="description" content="Generated by create OutreachApp" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        authorized &&
        <div className={style.custom}>
          <Alert />
          <Component {...pageProps} />
        </div>
      }
    </>
  );
}

export default MyApp;
