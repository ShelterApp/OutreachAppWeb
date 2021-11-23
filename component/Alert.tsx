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
  const [alert, setAlert] = useState<any>();

  useEffect(() => {
    // subscribe to new alert notifications
    const subscription = alertService.onAlert().subscribe((alert) => {
      if (alert && alert.message) {
        setAlert(alert);
        setTimeout(() => removeAlert(alert), 4000);
      }
    });

    return () => {
      subscription.unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeAlert = (alert: any) => {
    setTimeout(() => {
      setAlert(undefined);
      alertService.clear(id)
    }, 250);
  };

  const alertTypeClass = {
    [AlertType.Success]: "success",
    [AlertType.Error]: "error",
    [AlertType.Info]: "info",
    [AlertType.Warning]: "warning",
  };

  if (!alert) return null;

  return (
    <>
      {
        alert.message &&
        <div style={{ position: 'absolute', padding:10,width:'100%' }}>
          <AlertMui variant="filled" severity={alertTypeClass[alert.type] as any}>
            {alert.message}
          </AlertMui>
        </div>
      }
    </>
  );
}
