import { useState } from 'react';
import './TokenPopup.css'
import './TokenPopup-light.css'
import './TokenPopup-dark.css'
function importAll(r) {
    let images = {};
    r.keys().map((item) => { images[item.replace('./', '')] = r(item); });
    return images;
}
const images = importAll(require.context('../../assets/images/tokens', false, /\.svg/));
console.log(images);
const TokenPopup = (props) => {
    const setToken = props.tokenState;
    const setPopup = props.popupState;
    const tokens = props.tokens;
    const [searchedToken, setSearchedToken] = useState('');
    const [filteredTokens, setFilteredTokens] = useState([...tokens]);

    const handleChange = (e) => {
        const search = e.target.value;
        setSearchedToken(e.target.value);

        const filtered = tokens.filter((token) => token.toLowerCase().includes(search.toLowerCase()));
        setFilteredTokens(filtered);
    }

    return (
        <div className="token-popup-wrapper" onClick={(e) => (e.target.className === "token-popup-wrapper") && setPopup(false)}>
            <div className="token-popup">
                <div className="header">
                    <h2>Select token</h2>
                    <span class="material-symbols-outlined close" onClick={e => setPopup(false)}>close</span>
                </div>
                <div className="searchbar">
                    <span class="material-symbols-outlined">search</span>
                    <input type="text" name="search" id="search" autoFocus placeholder="Search" value={searchedToken} onChange={handleChange}/>
                </div>
                <h3>Search results</h3>
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