import * as React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Copyright from "./components/Copyright";
import BasicTabs from "./components/BasicTabs";
import { Button, Stack } from "@mui/material";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import { ethers } from "ethers";

import MemoContract from "./artifacts/Memo.json";
import { ContextWeb3 } from "./context";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export default function App() {
    const [account, setAccount] = React.useState("");
    const [balance, setBalance] = React.useState(0n);
    const [contract, setContract] = React.useState(null);
    const [tokens, setTokens] = React.useState(0n);
    const [price, setPrice] = React.useState(0n);

    // handle modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const connectWallet = async () => {
        if (account) {
            handleOpen();
            return;
        }
        if (!window.ethereum) {
            alert("Please install MetaMask first.");
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();

        // call rpc command
        const _account = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        setAccount(_account[0]);

        // call rpc	command
        const _balance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [_account[0], "latest"],
        });
        setBalance(_balance);

        // connect to the contract

        const _contract = new ethers.Contract(
            "0x7ea2e7CF1B0cc03c38eDdC3814171048A11d39f1", // contract address
            MemoContract.abi, //	ABI
            signer // signer
        );
        setContract(_contract);
        const _tokens = await _contract.balanceOf(_account[0]);

        //_tokens bigIntegers to string
        setTokens(_tokens);

        const _price = await _contract.getPriceOfToken();
        // console.log(_price);
        setPrice(_price);

        // change account metamask
        window.ethereum.on("accountsChanged", async (accounts) => {
            await connectWallet();
        });
    };

    const logout = () => {
        setAccount("");
        setBalance(0n);
        setContract(null);
        setTokens(0n);
        handleClose();
    };
    return (
        <ContextWeb3.Provider value={{ contract, price, setTokens, account }}>
            <Container maxWidth="sm">
                <Box sx={{ my: 4 }}>
                    <Stack direction={"row"} justifyContent={"end"}>
                        <Button onClick={connectWallet} variant="contained">
                            {account
                                ? `${account.slice(0, 7)}...${account.slice(
                                      37
                                  )}`
                                : "Connect"}
                        </Button>
                    </Stack>
                    <BasicTabs />
                    <Copyright />
                </Box>

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title">
                            My account: {account}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Balance: {ethers.utils.formatEther(balance)} ETH
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Token: {ethers.utils.formatEther(tokens)} MEMO
                        </Typography>
                        <Button
                            sx={{ mt: 5 }}
                            onClick={logout}
                            variant="contained"
                        >
                            Log out
                        </Button>
                    </Box>
                </Modal>
            </Container>
        </ContextWeb3.Provider>
    );
}
