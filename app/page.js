'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Typography, TextField, Stack, Modal, Box, Button } from "@mui/material";
import { query, doc, collection, getDocs, setDoc, getDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [totalItems, setTotalItems] = useState(0);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    let total = 0;

    docs.forEach((doc) => {
      const data = doc.data();
      const item = {
        name: doc.id,
        quantity: data.quantity || 0,
        imageUrl: data.imageUrl || '/default_image.png' // Replace with your default image path
      };
      total += item.quantity;
      inventoryList.push(item);
    });

    setInventory(inventoryList);
    setTotalItems(total);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity > 0) {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1, imageUrl: '/default_image.png' }); // Set default image URL for new items
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" alignItems="center" bgcolor="#f8d7da">
      {/* Image Header */}
      <Box width="100%" height="25vh" display="flex" alignItems="center" justifyContent="center" position="relative" mb={2}>
        <img
          src="/donuts.jpeg"
          alt="Header Background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
          }}
        />
      </Box>

      {/* Main Content */}
      <Box width="100%" flexGrow={1} display="flex" flexDirection="column" alignItems="center" p={2} bgcolor="#f8d7da">
        <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ backgroundColor: "#ff6d0d", mb: 2 }}>
          Add New Item
        </Button>
        <Modal open={open} onClose={handleClose}>
          <Box position="absolute" top="50%" left="50%" width={400} bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{ transform: "translate(-50%, -50%)" }}>
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField variant='outlined' fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} />
              <Button variant="outlined" onClick={() => { addItem(itemName); setItemName(''); handleClose(); }}>Add</Button>
            </Stack>
          </Box>
        </Modal>
        <Box width="800px" bgcolor="white" border="1px solid #333" mb={2} sx={{ borderRadius: '16px' }}>
          <Box height="100px" display="flex" alignItems="center" justifyContent="flex-start" bgcolor="#ff6d0d" color="white" sx={{ borderBottom: '3px solid #f5a623', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <img
                src="/dunkinlogo.png"
                alt="Dunkin' Donuts Logo"
                width={300}
                height={60}
                style={{ objectFit: 'contain' }}
              />
              <Typography variant="h4">
                Select Items
              </Typography>
            </Stack>
          </Box>
          <Box height="calc(100vh - 400px)" overflow="auto" p={2} bgcolor="white" sx={{ borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
            <Stack spacing={2}>
            {inventory.map(({ name, quantity }) => (
              <Box key={name} width="100%" minHeight="150px" display="flex" alignItems="center" justifyContent="space-between" bgcolor="white" p={3} border="1px solid #ddd" sx={{ borderRadius: '16px' }}>
                {(() => {
                  const formattedName = name
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                  return (
                    <>
                      <img src={`/${name.replace(/\s+/g, '_')}.png`} alt={name} width={100} height={100} style={{ objectFit: 'contain', borderRadius: '8px' }} />
                      <Typography variant="h5" color="#333" flexGrow={1}>{formattedName}</Typography>
                      <Typography variant="h6" color="#333" textAlign="center" minWidth="120px">Quantity: {quantity}</Typography>
                      <Stack direction="row" spacing={2}>
                        <Button variant="contained" sx={{ backgroundColor: "#f20c90", color: "#fff" }} onClick={() => { addItem(name) }}>Add</Button>
                        {quantity > 0 && (
                          <Button variant="contained" sx={{ backgroundColor: "#f20c90", color: "#fff" }} onClick={() => { removeItem(name) }}>Remove</Button>
                        )}
                      </Stack>
                    </>
                  );
                })()}
              </Box>
            ))}
            </Stack>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" p={2} bgcolor="white" sx={{ borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
            <Typography variant="h5" color="#333">Total Items: {totalItems}</Typography>
            <Button variant="contained" color="primary" sx={{ backgroundColor: "#ff6d0d" }}>Checkout</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
