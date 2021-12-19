import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from "component/Button";
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { getAutomaticTypeDirectiveNames } from 'typescript';

const EventCard = ({event, handleOpenAlert, edit}: any) => {
  const _delete = () => {
    handleOpenAlert(event._id)
  }
  const clickedit = () => {
    edit(event._id)
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const attendes = event.attendes.map((obj: any) => obj.userName).join(', ');

  const card = (
    <React.Fragment>
      <CardContent>
        <Typography variant="body2">
          <b>Event Name:</b> {event.title}
        </Typography>
        <Typography variant="body2">
          <b>Created:</b> {dayjs(event.createdAt).format("MMMM DD, YYYY")} By {event.createdBy.name}
        </Typography>
        {
          event.address && (
            <Typography variant="body2">
              <b>Location:</b> {event.address}
            </Typography>
          )
        }
        <Typography variant="body2">
          <b>Distribution On:</b> {dayjs(event.startDate).format("DD/MM/YYYY h:mm A")} - {dayjs(event.endDate).format("h:mm A")}
        </Typography>
        {
          event.maxAttended && (
            <Typography variant="body2">
              <b>Max Attendes:</b> {event.maxAttended}
            </Typography>
          )
        }
        <Typography variant="body2">
          <b>Attendes ({event.attendes.length}):</b> {attendes}
        </Typography>
      </CardContent>
      <CardActions>
        <Button text={'Edit'} onClick={clickedit}/>
        <Button text={'Delete'} onClick={_delete}/>
      </CardActions>
    </React.Fragment>
  );

  return (
    <>
      <Box sx={{ width: '100%', marginBottom: '10px' }}>
        <Card variant="outlined">{card}</Card>
      </Box>
    </>
  )
}

export default EventCard;
