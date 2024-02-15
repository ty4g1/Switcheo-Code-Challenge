import { useEffect, useState } from 'react';
import TokenPopup from '../TokenPopup/TokenPopup';
import './ExchangeForm.css';

function importAll(r) {
    let images = {};
    r.keys().map((item) => { images[item.replace('./', '')] = r(item); });
    return images;
}
const images = importAll(require.context('../../assets/images/tokens', false, /\.svg/));

const ExchangeForm = () => {
    const [prices, setPrices] = useState([]);
    const [inAmount, setInAmount] = useState();
    const [inToken, setInToken] = useState('');
    const [outAmount, setOutAmount] = useState();
    const [outToken, setOutToken] = useState('');
    const [inPopup, setInPopup] = useState(false);
    const [outPopup, setOutPopup] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        if (!(inToken && outToken)) {
            setError("Please select a token");
        } else if (!(inAmount && outAmount)) {
            setError("You cannot exchange zero tokens");
        } else {
            setMessage("Exchange successful!");
            setInAmount('');
            setOutAmount('');
            setInToken('');
            setOutToken('');
        }
    };

    const computeExchange = (amount, inCurrency, outCurrency) => {
        if (!(inCurrency && outCurrency)) { 
            return 0;
        }
        const inPrice = prices.find(element => element.currency === inCurrency).price;
        const outPrice = prices.find(element => element.currency === outCurrency).price;

        return amount * inPrice / outPrice;
    }

    const getPrice = (token, amount) => {
        const data = prices.find(entry => entry.currency === token);
        if (data && amount) {
            return data.price * amount;
        } else {
            return 0;
        }
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

    useEffect(() => {
        if (inToken && outToken) {
            setOutAmount(computeExchange(inAmount, inToken, outToken));
        }
    }, [inToken, outToken])

    return (
        <div className="exchange-form">
            {inPopup && <TokenPopup tokenState={setInToken} popupState={setInPopup} tokens={prices.map(entry => entry.currency)}></TokenPopup>}
            {outPopup && <TokenPopup tokenState={setOutToken} popupState={setOutPopup} tokens={prices.map(entry => entry.currency)}></TokenPopup>}
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <h2>Token Exchange</h2>

                    {/* <label htmlFor="input-token">Choose token</label>
                    <select name="input-token" id="input-token" value={inToken} 
                    onChange={e => {setInToken(e.target.value)
                                    setOutAmount(computeExchange(inAmount, e.target.value, outToken))}}>
                        {prices && prices.map(entry => 
                            <option value={entry.currency}>{entry.currency}</option>
                        )}
                    </select> */}

                    
                    <div className='form-box'>
                        <label htmlFor="input-amount">Send</label>
                        <div className='input-fields'>
                            <input type="number" 
                                min="0"
                                step="any"
                                name="input-amount" 
                                id="input-amount"
                                placeholder='0' 
                                value={inAmount} 
                                onChange={e => {setInAmount(e.target.value);
                                                if (inToken && outToken) {
                                                    setOutAmount(computeExchange(e.target.value, inToken, outToken));
                                                }}}/>
                            
                            {!inToken && <p className='token-select-false' onClick={e => setInPopup(true)}>Select Token <span class="material-symbols-outlined">expand_more</span></p>}
                            {inToken && <p className='token-select-true' onClick={e => setInPopup(true)}>
                                <img src={images[inToken + ".svg"]} alt="" />
                                <p>{inToken}</p>
                                <span class="material-symbols-outlined">expand_more</span>
                                </p>}
                        </div>
                        <div className='price'>${getPrice(inToken, inAmount)}</div>
                    </div>

                    <span class="material-symbols-outlined swap-icon" onClick={e => {
                        const temp = inToken;
                        setInToken(outToken);
                        setOutToken(temp);
                    }}> swap_vert </span>

                    <div className='form-box'>
                        <label htmlFor="output-amount">Receive</label>
                        <div className='input-fields'>
                            <input type="number" 
                                min="0"
                                step="any"
                                name="output-amount" 
                                id="output-amount" 
                                placeholder='0'
                                value={outAmount} 
                                onChange={e => {setOutAmount(e.target.value);
                                                if (inToken && outToken) {
                                                    setInAmount(computeExchange(e.target.value, outToken, inToken));
                                }}}/>

                            {!outToken && <p className='token-select-false' onClick={e => setOutPopup(true)}>Select Token <span class="material-symbols-outlined">expand_more</span></p>}
                            {outToken && <p className='token-select-true' onClick={e => setOutPopup(true)}>
                                <img src={images[outToken + ".svg"]} alt="" />
                                <p>{outToken}</p>
                                <span class="material-symbols-outlined">expand_more</span>
                                </p>}
                        </div>
                        <div className='price'>${getPrice(outToken, outAmount)}</div>
                    </div>
                    {/* <label htmlFor="output-token">Choose token</label>
                    <select name="output-token" id="output-token" value={outToken} 
                    onChange={e => {setOutToken(e.target.value)
                                    setOutAmount(computeExchange(inAmount, inToken, e.target.value))}}>
                        <option value=''/>
                        {prices && prices.map(entry => 
                            <option value={entry.currency}>{entry.currency}</option>
                        )}
                    </select> */}

                    
                   {error && <div className="error"><p>{error}</p></div>}
                   {message && <div className="message"><p>{message}</p></div>}
                    <button>Exchange</button>
                </form>
            </div>
        </div>
    )
}

export default ExchangeForm;