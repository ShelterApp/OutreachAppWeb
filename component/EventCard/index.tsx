import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from "component/Button";
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CancelIcon from '@mui/icons-material/Cancel';

const EventCard = ({event, handleOpenAlert, edit, handleUpdateMaxAttendes, handleRemoveParticipant}: any) => {
  const _delete = () => {
    handleOpenAlert(event._id)
  }
  const clickedit = () => {
    edit(event._id)
  }

  const handlePlus = () => {
    handleUpdateMaxAttendes(event._id, Math.floor(event.maxAttended) + 1)
  }

  const handleMinus = () => {
    handleUpdateMaxAttendes(event._id, Math.floor(event.maxAttended) - 1)
  }

  const handleClose = (userId: string) => {
    const newAttended = event.attendes.filter((user: any) => user.userId !== userId);
    handleRemoveParticipant(event._id, userId, newAttended)
  }

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
          <b>Distribution On:</b> {dayjs(event.startDate).format("MMMM D, YYYY h:mm A")} - {dayjs(event.endDate).format("h:mm A")}
        </Typography>
        {
          event.maxAttended && (
            <Typography variant="body2" style={{ display: 'flex', alignItems: 'center', gridColumnGap: 5 }}>
              <b>Max Attendes: </b>
              <AddIcon className="cursor-pointer" fontSize="small" onClick={handlePlus}/>
              <span className='maxAttended'>{event.maxAttended}</span>
              <RemoveIcon className="cursor-pointer" fontSize="small" onClick={handleMinus}/>
            </Typography>
          )
        }
        <Typography variant="body2" style={{ display: 'flex', alignItems: 'center', gridColumnGap: 5 }}>
          <b>Attendes ({event.attendes.length}):</b>
          {event.attendes.map((e: any, key: number) => (
            <React.Fragment key={key}>
              { e.userName }
              <CancelIcon className="cursor-pointer" fontSize="small" onClick={() => handleClose(e.userId)}/>
            </React.Fragment>
          ))}
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
