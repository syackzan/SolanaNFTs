const getPriorityFee = async () => {

    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "qn_estimatePriorityFees",
            "params": {
                "last_n_blocks": 100,
                "account": "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
                "api_version": 2
            }
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        const response = await fetch(
            process.env.SOLANA_NODE,
            requestOptions
        );

        const result = await response.json();

        return result.result.per_compute_unit.medium;
    } catch (error) {
        console.error("Error:", error);
    }
}

module.exports = { getPriorityFee };