import  { useState } from 'react';
import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import DescriptionIcon from '@mui/icons-material/Description';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductAdmin from './ProductAdmin/ProductAdmin';
import DebtHistory from './DebtHistory/DebtHistory';
import SalesChart from './Chats/Charts';

export default function Admin() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const cards = [
    { title: 'Gráficas', icon: <BarChartIcon fontSize="large" />, content: <SalesChart/> },
    { title: 'Productos', icon: <StoreIcon fontSize="large" />, content: <ProductAdmin/> },
    { title: 'Ventas', icon: <ShoppingCartIcon fontSize="large" />, content: <DebtHistory/> },
    // { title: 'Reporte', icon: <DescriptionIcon fontSize="large" />, content: <div>Contenido de Reporte</div> },
  ];

  const handleCardClick = (title: string) => {
    setSelectedCard(title);
  };

  const handleBackClick = () => {
    setSelectedCard(null);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        gap: 2,
      }}
    >
      {selectedCard ? (
        <>
          <IconButton onClick={handleBackClick} sx={{ alignSelf: 'flex-start', m: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            {cards.find(card => card.title === selectedCard)?.content}
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {cards.map((card, index) => (
            <Card 
              key={index} 
              sx={{ 
                minWidth: 250, 
                textAlign: 'center',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  backgroundColor: "#f5f5f580",
                },
              }}
              onClick={() => handleCardClick(card.title)}
            >
              <CardContent>
                {card.icon}
                <Typography variant="h5" component="div">
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}