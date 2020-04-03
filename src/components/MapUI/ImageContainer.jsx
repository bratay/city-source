import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: theme.spacing(12),
    padding: theme.spacing(1),
    backgroundColor: '#F06E38'
  },
  media: {
    height: theme.spacing(12),
    paddingTop: '56.25%', // 16:9,
    borderRadius: '5px'
  },
}));

const ImageContainer = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={require('./citysource.png')}
          title="Image"
        />
      </CardActionArea>
    </Card>
  );
}

export default ImageContainer;
