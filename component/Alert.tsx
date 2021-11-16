import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import { alertService, AlertType } from "services";
import AlertMui from "@mui/material/Alert";
export { Alert };

Alert.propTypes = {
  id: PropTypes.string,
  fade: PropTypes.bool,
};

Alert.defaultProps = {
  id: "default-alert",
  fade: true,
};

function Alert({ id, fade }: any) {
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // subscribe to new alert notifications
    const subscription = alertService.onAlert(id).subscribe((alert) => {
      // clear alerts when an empty alert is received
      if (!alert.message) {
        setAlerts((alerts) => {
          // filter out alerts without 'keepAfterRouteChange' flag
          const filteredAlerts = alerts.filter(
            (x: any) => x.keepAfterRouteChange
          );

          // set 'keepAfterRouteChange' flag to false on the rest
          filteredAlerts.forEach((x: any) => delete x.keepAfterRouteChange);
          return filteredAlerts;
        });
      } else {
        // add alert to array
        setAlerts((alerts: any) => [...alerts, alert] as any);

        // auto close alert if required
        if (alert.autoClose) {
          setTimeout(() => removeAlert(alert), 3000);
        }
      }
    });

    // clear alerts on location change
    const clearAlerts = () => {
      setTimeout(() => alertService.clear(id));
    };
    router.events.on("routeChangeStart", clearAlerts);

    // clean up function that runs when the component unmounts
    return () => {
      // unsubscribe to avoid memory leaks
      subscription.unsubscribe();
      router.events.off("routeChangeStart", clearAlerts);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeAlert = (alert: any) => {
    if (fade) {
      // fade out alert
      const alertWithFade = { ...alert, fade: true };
      setAlerts((alerts: any) =>
        alerts.map((x: any) => (x === alert ? alertWithFade : x))
      );

      // remove alert after faded out
      setTimeout(() => {
        setAlerts((alerts) => alerts.filter((x) => x !== alertWithFade));
      }, 250);
    } else {
      // remove alert
      setAlerts((alerts) => alerts.filter((x) => x !== alert));
    }
  };

  const alertTypeClass = {
    [AlertType.Success]: "success",
    [AlertType.Error]: "error",
    [AlertType.Info]: "info",
    [AlertType.Warning]: "warning",
  };

  if (!alerts.length) return null;

  return (
    <>
      {alerts.map((alert: any, index) => (
        <AlertMui key={index} severity={alertTypeClass[alert.type] as any}>
          {alert.message}
        </AlertMui>
      ))}
    </>
  );
}
