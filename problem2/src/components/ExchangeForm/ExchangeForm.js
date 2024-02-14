import { useEffect, useState } from 'react';

const ExchangeForm = () => {
    const handleSubmit = (e) => {};
    const [prices, setPrices] = useState();
    const [inAmount, setInAmount] = useState([]);
    const [inToken, setInToken] = useState('ETH');
    const [outAmount, setOutAmount] = useState(0);
    const [outToken, setOutToken] = useState('');

    const computeExchange = (amount, inCurrency, outCurrency) => {
        if (!(inCurrency && outCurrency)) {
            return 0;
        }
        const inPrice = prices.find(element => element.currency === inCurrency).price;
        const outPrice = prices.find(element => element.currency === outCurrency).price;

        return amount * inPrice / outPrice;
    }

    // Fetch prices data to compute exchanges
    useEffect(() => {
        const fetchPrices = async () => {
            const response = await fetch('https://interview.switcheo.com/prices.json');
            const pricesInfo = await response.json();

            if (response.ok) {
                setPrices([...pricesInfo]);
            }
            
        }
        fetchPrices();
    }, [])

    return (
        <div className="exchange-form">
            <form onSubmit={handleSubmit}>
                <h2>Swap</h2>

                <label htmlFor="input-token">Choose token</label>
                <select name="input-token" id="input-token" value={inToken} onChange={e => setInToken(e.target.value)}>
                    {prices && prices.map(entry => 
                        <option value={entry.currency}>{entry.currency}</option>
                    )}
                </select>

                <label htmlFor="input-amount">Amount to send</label>
                <input type="number" name="input-amount" id="input-amount" value={inAmount} 
                onChange={e => {setInAmount(e.target.value);
                                setOutAmount(computeExchange(e.target.value, inToken, outToken))}}/>

                <label htmlFor="output-token">Choose token</label>
                <select name="output-token" id="output-token" value={outToken} onChange={e => setOutToken(e.target.value)}>
                    <option value=''/>
                    {prices && prices.map(entry => 
                        <option value={entry.currency}>{entry.currency}</option>
                    )}
                </select>

                <label htmlFor="input-amount">Amount to receive</label>
                <input type="number" name="output-amount" id="output-amount" value={outAmount} 
                onChange={e => {setOutAmount(e.target.value);
                                setInAmount(computeExchange(e.target.value, outToken, inToken))}}/>

                <button>CONFIRM SWAP</button>
            </form>
        </div>
    )
}

export default ExchangeForm;