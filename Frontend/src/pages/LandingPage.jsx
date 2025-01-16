import { Box, Button, Container, Typography, Grid, Paper, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  ArrowForward as ArrowForwardIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Styled components for custom effects
const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  fontWeight: 'bold'
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Fast & Efficient',
      description: 'Quick ticket creation and real-time updates for seamless issue tracking'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure System',
      description: 'Enterprise-grade security to protect your sensitive support data'
    },
    {
      icon: <SupportIcon sx={{ fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Round-the-clock support system with automated ticket routing'
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={4}>
                <GradientText variant="h2" component="h1">
                  Streamline Your Support
                </GradientText>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
                  Manage support tickets efficiently with our modern ticket management system.
                  Track, resolve, and analyze support issues in one place.
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={() => navigate('/auth/login')}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ 
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      fontSize: '1.1rem'
                    }}
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    sx={{ 
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      fontSize: '1.1rem'
                    }}
                  >
                    Learn More
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/dashboard-preview.png" // Add your dashboard preview image
                alt="Dashboard Preview"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 8
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ mb: 8 }}
        >
          Key Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <FeatureCard elevation={4}>
                <Stack spacing={2} alignItems="center" textAlign="center">
                  <Box sx={{ color: 'primary.main' }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3">
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </Stack>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
        <Container>
          <Grid container spacing={4} justifyContent="center">
            {[
              { number: '99%', label: 'Customer Satisfaction' },
              { number: '24/7', label: 'Support Available' },
              { number: '10k+', label: 'Tickets Resolved' }
            ].map((stat, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box textAlign="center">
                  <Typography 
                    variant="h3" 
                    component="div" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: 'primary.main'
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <Paper 
          sx={{ 
            p: { xs: 4, md: 8 },
            textAlign: 'center',
            background: 'linear-gradient(45deg, #1a237e, #311b92)',
            borderRadius: 4
          }}
        >
          <Typography variant="h4" component="h2" sx={{ mb: 3, color: 'white' }}>
            Ready to Get Started?
          </Typography>
          <Typography sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.8)' }}>
            Join thousands of teams who trust our platform for their support needs.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/auth/login')}
            sx={{ 
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)'
              }
            }}
          >
            Start Free Trial
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default LandingPage;