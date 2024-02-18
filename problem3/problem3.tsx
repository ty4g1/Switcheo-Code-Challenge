// ASSUMING ALL DEPENDENCIES HAVE BEEN IMPORTED BEFOREHAND 
// REACT DEPENDENCIES (useEffect, useMemo)
// Interfaces (BoxProps)
// React components (WalletRow)
// React hooks (useWalletBalances)
// CSS Styles and Classes

interface WalletBalance {
    currency: string;
    amount: number;
}
interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
}
  
// Implemented the Datasource class
class Datasource {
    apiUrl: string;

    constructor(url: string) {
        this.apiUrl = url;
    }

    async getPrices(): Promise<{}> {
        const response = await fetch(this.apiUrl);
        return response.json();
    }

}
  
interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {

    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const [prices, setPrices] = useState({});
  
    useEffect(() => {
      const datasource = new Datasource("https://interview.switcheo.com/prices.json");
      datasource.getPrices().then(prices => {
        setPrices(prices);
      }).catch(error => {
        console.err(error);
      });
    }, []);

    // Use an object to store the priorities and retreive them efficiently
    // Better than using switch-case statements
    const getPriority = (blockchain: any): number => {
        const priorityTable = {
            "Osmosis": 100,
            "Ethereum": 50,
            "Arbitrum": 30,
            "Zilliqa": 20,
            "Neo": 20,
        }
        return priorityTable[blockchain] || -99;
    }
  
    const sortedBalances = useMemo(() => {
        return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            //Changed lhsPriority (undeclared) to balancePriority
            if (balancePriority > -99) {
                if (balance.amount <= 0) {
                    return true;
                }
            }
            return false
            }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
                        const leftPriority = getPriority(lhs.blockchain);
                        const rightPriority = getPriority(rhs.blockchain);
                        // Achieves the same effect as the if-else statements in a more concise manner
                        // Also handles the case of equal priority
                        return rightPriority - leftPriority;
                    }
            );
    }, [balances, prices]);
  
    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed()
      }
    })
    
    // Use formattedBalances instead of sortedBalances
    const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow 
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  
    return (
      <div {...rest}>
        {rows}
      </div>
    )
  }