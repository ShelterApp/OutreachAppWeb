import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

const CampCard = ({camp, handleOpenAlert, edit}: any) => {
  const _delete = () => {
    handleOpenAlert(camp._id)
  }
  const clickedit = () => {
    edit(camp._id)
  }
  const card = (
    <React.Fragment>
      <CardContent>
        <Typography variant="body2">
          <b>Camp Name:</b> {camp.name}
        </Typography>
        <Typography variant="body2">
          <b>Created On:</b> {dayjs(camp.createdAt).format("MMMM DD, YYYY")}
        </Typography>
        {
          camp.createdBy && (
            <Typography variant="body2">
              <b>Created By:</b> {camp.createdBy.name}
            </Typography>
          )
        }
        <Typography variant="body2">
          <b>Updated On:</b> {dayjs(camp.updatedAt).format("MMMM DD, YYYY")}
        </Typography>
        {
          camp.updatedBy && (
            <Typography variant="body2">
              <b>Updated By:</b> {camp.updatedBy.name}
            </Typography>
          )
        }
        {
          camp.address && (
            <Typography variant="body2">
              <b>City:</b> {camp.address}
            </Typography>
          )
        }
        {
          camp.description && (
            <Typography variant="body2">
              <b>Description:</b> {camp.description}
            </Typography>
          )
        }
      </CardContent>
      <CardActions>
        <Button variant="contained" onClick={clickedit} size="medium">Edit</Button>
        <Button variant="contained" onClick={_delete} size="medium">Delete</Button>
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

export default CampCard;
