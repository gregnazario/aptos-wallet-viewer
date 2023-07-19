import {Button, Col, Input, Row} from "antd";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import {useState} from "react";
import {DEVNET_PROVIDER, onStringChange, runTransaction, TransactionContext} from "./Helper";
import {AnsClient} from "aptos";

const ANS_CLIENT = new AnsClient(DEVNET_PROVIDER);

function Transfer(props: TransactionContext) {
    const [objectAddress, setObjectAddress] = useState<string>("");
    const [destinationAddress, setDestinationAddress] = useState<string>("");

    const transferObject = async () => {
        // Ensure you're logged in
        if (!props.account || !objectAddress) return [];

        let realDestination = await getAddress(destinationAddress);

        const payload = {
            type: "entry_function_payload",
            function: `0x1::object::transfer`,
            type_arguments: ["0x1::object::ObjectCore"],
            arguments: [objectAddress, realDestination],
        };
        await runTransaction(props.submitTransaction, payload);
    }

    const getAddress = async (possibleAddress: string) => {
        let lookup = await ANS_CLIENT.getAddressByName(destinationAddress);
        if (lookup) {
            return lookup;
        } else {
            return destinationAddress;
        }
    };

    return (
        <>
            <Row align={"middle"}>
                <Col span={4}>
                    <h3>Transfer Object</h3>
                </Col>
            </Row>
            <Row align="middle">
                <Col span={4}>
                    <p>Object address: </p>
                </Col>
                <Col flex={"auto"}>
                    <Input
                        onChange={(event) => {
                            onStringChange(event, setObjectAddress)
                        }}
                        style={{width: "calc(100% - 60px)"}}
                        placeholder="Object Address"
                        size="large"
                        defaultValue={""}
                    />
                </Col>
            </Row>
            <Row align="middle">
                <Col span={4}>
                    <p>Destination address: </p>
                </Col>
                <Col flex={"auto"}>
                    <Input
                        onChange={(event) => {
                            onStringChange(event, setDestinationAddress)
                        }}
                        style={{width: "calc(100% - 60px)"}}
                        placeholder="Destination Address"
                        size="large"
                        defaultValue={""}
                    />
                </Col>
            </Row>
            <Row align="middle">
                <Col span={4} offset={4}>
                    <Button
                        onClick={() => transferObject()}
                        type="primary"
                        style={{height: "40px", backgroundColor: "#3f67ff"}}
                    >
                        Transfer Object
                    </Button>
                </Col>
            </Row>
        </>
    );
}

export default Transfer;