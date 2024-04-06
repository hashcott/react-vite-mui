import * as React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Copyright from "./components/Copyright";
import BasicTabs from "./components/TabControl";
import { Button, Stack } from "@mui/material";
import { BrowserProvider } from "ethers";
export default function App() {
  const [account, setAccount] = React.useState("");
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask first.");
      return;
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const account = await signer.getAddress();
    setAccount(account);
  };
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Stack direction={"row"} justifyContent={"end"}>
          <Button onClick={connectWallet} variant="contained">
            {account
              ? `${account.slice(0, 7)}...${account.slice(37)}`
              : "Connect"}
          </Button>
        </Stack>
        <BasicTabs />
        <Copyright />
      </Box>
    </Container>
  );
}
