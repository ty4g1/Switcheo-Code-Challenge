import { useEffect, useMemo, useState } from 'react';
import TokenPopup from '../TokenPopup/TokenPopup';
import ThemeToggleButton from '../ThemeToggleButton/ThemeToggleButton';
import './ExchangeForm.css'
import './ExchangeForm-light.css';
import './ExchangeForm-dark.css';

// Importing svg images for tokens
function importAll(r) {
    let images = {};
    r.keys().map((item) => { images[item.replace('./', '')] = r(item); });
    return images;
}
const images = importAll(require.context('../../assets/images/tokens', false, /\.svg/));

const ExchangeForm = () => {
    //Initializing prices state
    const [prices, setPrices] = useState([]);
    
    // Initializing states for input fields
    const [inAmount, setInAmount] = useState();
    const [inToken, setInToken] = useState('');
    const [outAmount, setOutAmount] = useState();
    const [outToken, setOutToken] = useState('');

    // Initializing popup states
    const [inPopup, setInPopup] = useState(false);
    const [outPopup, setOutPopup] = useState(false);

    //Initializing error and message states
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    
    // Handling Submission of exchangeForm
    const handleSubmit = (e) => {

        // Prevent refresh
        e.preventDefault();

        // Reset error and message
        setError("");
        setMessage("");

        // Check for selected tokens and set error accordingly
        if (!(inToken && outToken)) {
            setError("Please select a token");
        }
        // Check for non-zero amount and set error accordingly
        else if (!(inAmount && outAmount)) {
            setError("You cannot exchange zero tokens");
        } 
        // Update message and reset input fields 
        else {
            setMessage("Exchange successful!");
            setInAmount('');
            setOutAmount('');
            setInToken('');
            setOutToken('');
        }
    };

    // Function to calculate exchange value using prices array
    const computeExchange = (amount, inCurrency, outCurrency) => {
        if (!(inCurrency && outCurrency)) { 
            return 0;
        }
        const inPrice = prices.find(element => element.currency === inCurrency).price;
        const outPrice = prices.find(element => element.currency === outCurrency).price;

        return amount * inPrice / outPrice;
    }

    // Funtion to get the price (in USD) for a given token
    const getPrice = (token, amount) => {
        const data = prices.find(entry => entry.currency === token);
        if (data && amount) {
            return data.price * amount;
        } else {
            return 0;
        }
    }

    // Fetch prices data using the API endpoint provided, whenever the page is rendered
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

    // Recompute exchange amounts only when selected tokens are changed
    useMemo(() => {
        if (inToken && outToken) {
            setOutAmount(computeExchange(inAmount, inToken, outToken));
        }
    }, [inToken, outToken])

    return (
        <div className="exchange-form">

            {/* Button to toggle light or dark mode */}
            <ThemeToggleButton/>

            {/* The popup/modal component to select (in or out) token */}
            {inPopup && <TokenPopup tokenState={setInToken} popupState={setInPopup} tokens={prices.map(entry => entry.currency)}></TokenPopup>}
            {outPopup && <TokenPopup tokenState={setOutToken} popupState={setOutPopup} tokens={prices.map(entry => entry.currency)}></TokenPopup>}
            
            {/* wrapper div containing the exchange form */}
            <div className="wrapper">
                <h2>Token Exchange</h2>
                <form onSubmit={handleSubmit}>
                    {/* div containing label, input, select token button and price display */}
                    <div className='form-box'>
                        <label htmlFor="input-amount">Send</label>
                        {/* Input field allowing only positive numeric input (including float numbers) */}
                        <div className='input-fields'>
                            <input type="number" 
                                min="0"
                                step="any"
                                name="input-amount" 
                                id="input-amount"
                                placeholder='0' 
                                autoFocus
                                value={inAmount} 
                                // Compute exchange amount output on input change
                                onChange={e => {setInAmount(e.target.value);
                                                if (inToken && outToken) {
                                                    setOutAmount(computeExchange(e.target.value, inToken, outToken));
                                                }}}/>
                           
                            {/* If no token has been selected, display select token button, display popup on click */}
                            {!inToken && <p className='token-select-false' onClick={e => setInPopup(true)}>Select Token <span class="material-symbols-outlined">expand_more</span></p>}
                            
                            {/* If token has been selected, display token name and icon, 
                            while still being a token select button and display popup on click */}
                            {inToken && <p className='token-select-true' onClick={e => setInPopup(true)}>
                                <img src={images[inToken + ".svg"]} alt="" />
                                <p>{inToken}</p>
                                <span class="material-symbols-outlined">expand_more</span>
                                </p>}

                        </div>
                        
                        {/* Display price of selected token's amount */}
                        <div className='price'>${getPrice(inToken, inAmount)}</div>
                    </div>

                    <span class="material-symbols-outlined swap-icon" onClick={e => {
                        const temp = inToken;
                        setInToken(outToken);
                        setOutToken(temp);
                    }}> swap_vert </span>

                    {/* Same as input wrapper, modifying different states (for output field now)  */}
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
                    
                    {/* Button to submit form */}
                    <button>Exchange</button>
                </form>
                
                {/* Error and message divs to display error or success to user */}
                {error && <div className="error"><p>{error}</p></div>}
                {message && <div className="message"><p>{message}</p></div>}
            </div>
        </div>
    )
}

export default ExchangeForm;