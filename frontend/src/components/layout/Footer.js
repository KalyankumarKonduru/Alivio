import React from 'react';
import { Container, Typography, Grid, Link as MuiLink, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(6, 0),
    marginTop: 'auto',
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.common.white,
  },
  footerLink: {
    color: theme.palette.grey[400],
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  footerHeading: {
    color: theme.palette.common.white,
    marginBottom: theme.spacing(2),
  },
  footerSection: {
    marginBottom: theme.spacing(3),
  },
  copyright: {
    marginTop: theme.spacing(4),
    textAlign: 'center',
  },
}));

const Footer = () => {
  const classes = useStyles();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className={classes.footerHeading}>
              Company
            </Typography>
            <div className={classes.footerSection}>
              <Typography>
                <MuiLink component={Link} to="/about" className={classes.footerLink}>
                  About Us
                </MuiLink>
              </Typography>
              <Typography>
                <MuiLink component={Link} to="/careers" className={classes.footerLink}>
                  Careers
                </MuiLink>
              </Typography>
              <Typography>
                <MuiLink component={Link} to="/press" className={classes.footerLink}>
                  Press
                </MuiLink>
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className={classes.footerHeading}>
              Support
            </Typography>
            <div className={classes.footerSection}>
              <Typography>
                <MuiLink component={Link} to="/help" className={classes.footerLink}>
                  Help Center
                </MuiLink>
              </Typography>
              <Typography>
                <MuiLink component={Link} to="/contact" className={classes.footerLink}>
                  Contact Us
                </MuiLink>
              </Typography>
              <Typography>
                <MuiLink component={Link} to="/faq" className={classes.footerLink}>
                  FAQ
                </MuiLink>
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className={classes.footerHeading}>
              Legal
            </Typography>
            <div className={classes.footerSection}>
              <Typography>
                <MuiLink component={Link} to="/terms" className={classes.footerLink}>
                  Terms of Service
                </MuiLink>
              </Typography>
              <Typography>
                <MuiLink component={Link} to="/privacy" className={classes.footerLink}>
                  Privacy Policy
                </MuiLink>
              </Typography>
              <Typography>
                <MuiLink component={Link} to="/cookies" className={classes.footerLink}>
                  Cookie Policy
                </MuiLink>
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className={classes.footerHeading}>
              Connect
            </Typography>
            <div className={classes.footerSection}>
              <Typography>
                <MuiLink href="https://facebook.com" target="_blank" className={classes.footerLink}>
                  Facebook
                </MuiLink>
              </Typography>
              <Typography>
                <MuiLink href="https://twitter.com" target="_blank" className={classes.footerLink}>
                  Twitter
                </MuiLink>
              </Typography>
              <Typography>
                <MuiLink href="https://instagram.com" target="_blank" className={classes.footerLink}>
                  Instagram
                </MuiLink>
              </Typography>
            </div>
          </Grid>
        </Grid>
        <Typography variant="body2" className={classes.copyright}>
          © {currentYear} Alivio. All rights reserved.
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;
