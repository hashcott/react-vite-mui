import React, { useContext } from "react";
import { ACTION_TYPE } from "../constants/actionType";
import TextField from "@mui/material/TextField";
import { Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { ContextWeb3 } from "../context";
import { ethers } from "ethers";

export const ActionTab = ({ actionType }) => {
    // use context here
    const { contract, price, setTokens, account } = useContext(ContextWeb3);
    const [total, setTotal] = React.useState(0);
    const [info, setInfo] = React.useState("");

    const controller = async () => {
        if (ACTION_TYPE.BUY === actionType) {
            // 0.01 ETH =>  wei
            // parseEther tham so string
            const transaction = await contract.buyToken({
                value: ethers.utils.parseEther(`${total}`),
                gasLimit: 100000,
            });

            await transaction.wait();
            alert("Transaction success");
            const tokens = await contract.balanceOf(account);
            await setTokens(tokens);
            // update price
        } else if (ACTION_TYPE.SELL === actionType) {
            // sellToken(uint256 _amount)
        }
    };
    const predict = (sl) => {
        const total = parseFloat(ethers.utils.formatEther(price)) * sl;
        setTotal(total);
        if (ACTION_TYPE.BUY === actionType) {
            setInfo(`${total}ETH => ${sl} MEMO`);
        } else if (ACTION_TYPE.SELL === actionType) {
            setInfo(`${sl} MEMO => ${total} ETH`);
        }
    };
    return (
        <>
            {contract === null ? (
                <Typography>Connect to the contract first</Typography>
            ) : (
                <>
                    <Stack spacing={2} direction="row">
                        <TextField
                            id="outlined-basic"
                            placeholder="Price/Token"
                            variant="outlined"
                            value={ethers.utils.formatEther(price)}
                            type="number"
                            disabled
                        />
                        <TextField
                            id="outlined-basic"
                            label="SL"
                            variant="outlined"
                            type="number"
                            onChange={(e) =>
                                predict(parseFloat(e.target.value))
                            }
                        />
                        <Button
                            variant="contained"
                            onClick={controller}
                            color="success"
                        >
                            {actionType}
                        </Button>
                    </Stack>
                    <Typography>{info}</Typography>
                </>
            )}
        </>
    );
};
