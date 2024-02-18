import { useState } from 'react';
import './TokenPopup.css'
import './TokenPopup-light.css'
import './TokenPopup-dark.css'

// Importing svg images for tokens
function importAll(r) {
    let images = {};
    r.keys().map((item) => { images[item.replace('./', '')] = r(item); });
    return images;
}
const images = importAll(require.context('../../assets/images/tokens', false, /\.svg/));


const TokenPopup = (props) => {
    // Accessing props to modify states of popup and tokens
    const setToken = props.tokenState;
    const setPopup = props.popupState;

    // Accessing list of tokens
    const tokens = props.tokens;

    // Setting states for searching and filtering tokens
    const [searchedToken, setSearchedToken] = useState('');
    const [filteredTokens, setFilteredTokens] = useState([...tokens]);

    // Function to handle change in search bar input
    // Looks for searched token and modifies searchedToken and filteredTokens states
    const handleChange = (e) => {
        const search = e.target.value;
        setSearchedToken(e.target.value);

        const filtered = tokens.filter((token) => token.toLowerCase().includes(search.toLowerCase()));
        setFilteredTokens(filtered);
    }

    return (
        // Wrapper div for the popop/modal. Closes the popup when clicked on
        <div className="token-popup-wrapper" onClick={(e) => (e.target.className === "token-popup-wrapper") && setPopup(false)}>
            <div className="token-popup">

                {/* Header containing h2 and close icon, which closes the popup whenc clicked */}
                <div className="header">
                    <h2>Select token</h2>
                    <span class="material-symbols-outlined close" onClick={e => setPopup(false)}>close</span>
                </div>

                {/* Searchbar div containing search icon and input field. Auto updates token list on input change */}
                <div className="searchbar">
                    <span class="material-symbols-outlined">search</span>
                    <input type="text" name="search" id="search" autoFocus placeholder="Search" value={searchedToken} onChange={handleChange}/>
                </div>

                <h3>Search results</h3>

                {/* Displays all filtered tokens matching the search term. Displays "No Tokens found!" if there are none */}
                <div className="tokens-list">
                    {filteredTokens && filteredTokens.map(token => 
                    <div className='token' onClick={e => {setToken(token); setPopup(false)}}><img src={images[token + ".svg"]} alt="" /><p>{token}</p></div>)}
                    {!filteredTokens.length && <div className='no-token'>No tokens found!</div>}
                </div>
                
            </div>
        </div>
    )
}

export default TokenPopup;