import React from 'react';
import { ButtonBase, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const categories = [
  { title: 'Add Tour Package', link: '/tour/package-manager', image: '/addHotel.jpg' },
  { title: 'Send Email Promotions', link: '/admin/email-send', image: '/ViewHotel.jpg' },
  { title: 'View Orders', link: '/admin/manage/tours', image: '/ViewHotel.jpg' },
];

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '200px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiTypography-root': {
      border: '5px solid white',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  },
}));

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

const TourDashboard = () => {
  const handleClick = (link) => {
    window.location.href = link;
  };

  return (
    <Paper elevation={3} style={{ padding: '2rem', margin: '2rem auto', maxWidth: '1200px' }}>
      <Typography variant="h4" gutterBottom style={{ textAlign: 'center' }}>
        Tour Package Management Dashboard
      </Typography>
      <Grid
        container
        spacing={2}
        justifyContent="center"  // Center the grid items horizontally
        alignItems="center"      // Center the grid items vertically
      >
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.title}>
            <ImageButton onClick={() => handleClick(category.link)}>
              <ImageSrc style={{ backgroundImage: `url(${category.image})` }} />
              <Typography
                component="span"
                variant="h5"
                color="inherit"
                sx={{
                  color: 'white',
                  position: 'absolute',
                  p: 2,
                  textAlign: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  opacity: 0.8,
                  transition: 'opacity 0.3s',
                  width: '80%',
                  maxWidth: '300px',
                  borderRadius: '8px',
                }}
              >
                {category.title}
              </Typography>
            </ImageButton>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default TourDashboard;
