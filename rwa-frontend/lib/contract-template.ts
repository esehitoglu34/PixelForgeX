const sorobanContractInterface = {
    name: "RWA Token",
    methods: {
        initialize: {
            parameters: [
                { name: "admin", type: "address" },
                { name: "metadata", type: "object" },
                { name: "initial_supply", type: "i128" }
            ]
        },
        transfer: {
            parameters: [
                { name: "to", type: "address" },
                { name: "amount", type: "i128" }
            ]
        }
    }
};

const wasmCode = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x07, 0x01, 0x60,
    0x02, 0x7f, 0x7f, 0x01, 0x7f, 0x03, 0x02, 0x01, 0x00, 0x07, 0x07, 0x01,
    0x03, 0x61, 0x64, 0x64, 0x00, 0x00, 0x0a, 0x09, 0x01, 0x07, 0x00, 0x20,
    0x00, 0x20, 0x01, 0x6a, 0x0b
]);

export { sorobanContractInterface, wasmCode };
