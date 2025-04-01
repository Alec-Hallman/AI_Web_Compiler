import { createContext, useEffect, useState } from "react";
import OpenAI from "openai";
export const appModel = createContext(null);

const AppManager = ({ children }) => {
  const [userInput, setInput] = useState("Write Code here!");
  const [tokens, setTokens] = useState("Token Stream");
  const [symTable, setTable] = useState("Symbol Table");
  const [assembly, setAssembly] = useState("Assembly Output");
  const [errorLog, setErrors] = useState("Errors will appear here:");
  async function LexicalAnalysis() {
    const client = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // Required for browser use
    });
    const response = await client.responses.create({
      model: "gpt-4o",
      input: `
      You are a lexical analyzer. Your task is to analyze the user input **letter by letter**, without considering whole words. You must validate each character and classify it as valid or invalid based on a predefined set of characters. YOU DO NOT CARE ABOUT WHITESPACES. Also periods are a valid character. If you encounter a character that is **not allowed**, output a lexical error along with the line number where the error occurred (based on the number of newlines in the message). If no errors are found, simply output "success".

### Valid Characters:
- Letters: a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
- Digits: 0 1 2 3 4 5 6 7 8 9
- Special Characters: ( ) [ ] < > == <= >= > < + - ; , . 

### Rules:
1. **Do not analyze words**—you are only concerned with individual characters.
2. If an invalid character is found, output the following format: 
Lexical error unknown character [char] on line [line number].
3. If no errors are found, output: success
4. Do not reply with any quotation marks in your reply.
5. Do not pay any attention to white spaces or new lines or tabs or spaces. We only care about characters which contain some value not blank information
6. Output as closely as possible to the example output while keeping the context focused on the users input.
#### Example 1:
**Input:**  
def int function(int x, double @) fed;
abcdefghijklmopqrstuvwxyz
ABCDEFGHIJKLMNOPQRSTUVWXYZ
**Output:**  
Lexical error unknown character @ on line 1.

#### Example 2:
**Input:**  
int x; x = 10;
**Output:**  
Success

### User Input:
Here is the input you need to analyze:
${userInput}`,
    });
    return response.output_text;
  }
  async function TokenStream() {
    const client = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // Required for browser use
    });
    const response = await client.responses.create({
      model: "gpt-4o",
      input: `You do not do conversational replies also do not reply with any quotation marks in your response. Your job is to read the user input word by word and tokenize it according to predefined categories. 
** Valid Characters ** Note a period is a valid character and it is a delimeter
( ) [ ] 1 2 3 4 5 6 7 8 9 0 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z <> == <= >= > < + - ; , .
If you see a character not in this list, then it is a token with type UNKNOWN

**Categories:**
- DELIMITER
- IDENTIFIER
- KEYWORD
- COMPARATOR
- MATH_OPERATOR
- INTEGER
- DOUBLE
- ASSGN_OPERATOR
- UNKNOWN

**Keywords** (must match exactly):
def, fed, if, fi, do, od, while, and, or, not, else, int, double, then

### Output Format:
Each lexeme should be classified and printed in the following format:
lexeme | CATEGORY
- Print **3 tokenized items per row**.
- If there are fewer than 3 items remaining, print the remaining items on their own row.
- Ensure proper alignment of the output for readability.
- No additional text, explanations, or formatting.
- Maintain original input order.
-Please format the output to be clean and make it look like a table, add white spaces to make each column make a clearly defined line from the top to the bottom unline the example output below.
- Output as closely as possible to the example output while keeping the context focused on the users input.
- do not reply with the word plaintext and do not include any quotation marks in your output " ' 
### Example:
### Input:
def int functionName(int x, double y)
 x = 10;
$ = 10;
y = 1.2323;
return 10;
fed.
### Output:
def         | KEYWORD       | int         | KEYWORD       | functionName | IDENTIFIER   
(           | DELIMITER     | int         | KEYWORD       | x            | IDENTIFIER   
,           | DELIMITER     | double      | KEYWORD       | y            | IDENTIFIER   
)           | DELIMITER     | x           | IDENTIFIER    | =            | ASSGN_OPERATOR
10          | INTEGER       | ;           | DELIMITER     | $            | UNKNOWN      
=           | ASSGN_OPERATOR| 10          | INTEGER       | ;            | DELIMITER    
y           | IDENTIFIER    | =           | ASSGN_OPERATOR| 1.2323       | DOUBLE       
;           | DELIMITER     | return      | IDENTIFIER    | 10           | INTEGER      
;           | DELIMITER     | fed         | KEYWORD       | .            | UNKNOWN 

Here is the user's input for you to tokenize. ${userInput}`,
    });
    return response.output_text;
  }
  function Compile() {
    console.log("Running compile function");
    LexicalAnalysis().then((answer) => {
      console.log(`Asked chat and got: ${answer}`);
      setErrors(answer);
    });
    TokenStream().then((answer) => {
      console.log(`Asked chat and got: ${answer}`);
      setTokens(answer);
    });
  }
  return (
    <appModel.Provider
      value={{
        userInput,
        tokens,
        symTable,
        assembly,
        errorLog,
        setInput,
        Compile,
      }}
    >
      {children}
    </appModel.Provider>
  );
};
export default AppManager;
