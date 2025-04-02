import { createContext, useEffect, useState } from "react";
import OpenAI from "openai";
export const appModel = createContext(null);

const AppManager = ({ children }) => {
  const [userInput, setInput] = useState("Write Code here!");
  const [tokens, setTokens] = useState("Token Stream");
  const [symTable, setTable] = useState("Symbol Table");
  const [assembly, setAssembly] = useState("Assembly Output");
  var [errorLog, setErrors] = useState("Errors will appear here:");
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
Lexical Analysis Success!

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
- END_PROGRAM (only for periods on their own)
- UNKNOWN

**Keywords** (must match exactly):
def, fed, if, fi, do, od, while, and, or, not, else, int, double, then, return

### Output Format:
Each lexeme should be classified and printed in the following format:
lexeme | CATEGORY
- Print one token per line
- Ensure proper alignment of the output for readability.
- No additional text, explanations, or formatting.
- Maintain original input order.
-Please format the output to be clean and make it look like a table, add white spaces to make each column make a clearly defined line from the top to the bottom unline the example output below.
- Output as closely as possible to the example output while keeping the context focused on the users input.
- do not reply with the word plaintext and do not include any quotation marks in your output " ' 
### Example:
### Input:
def int gcd(int a, int b)
	if(a==b) then
		return (a) 
	fi;
	if(a>b) then
		return(gcd(a-b,b))
	else 
		return(gcd(a,b-a)) 
	fi;
fed;
print gcd(21,15).
### Output:
def       |    KEYWORD        
int       |    KEYWORD        
gcd       |    IDENTIFIER     
(         |    DELIMITER      
int       |    KEYWORD        
a         |    IDENTIFIER     
,         |    DELIMITER      
int       |    KEYWORD        
b         |    IDENTIFIER     
)         |    DELIMITER      
if        |    KEYWORD        
(         |    DELIMITER      
a         |    IDENTIFIER     
==        |    COMPARATOR     
b         |    IDENTIFIER     
)         |    DELIMITER      
then      |    KEYWORD        
return    |    KEYWORD        
(         |    DELIMITER      
a         |    IDENTIFIER     
)         |    DELIMITER      
fi        |    KEYWORD        
;         |    DELIMITER      
if        |    KEYWORD        
(         |    DELIMITER      
a         |    IDENTIFIER     
>         |    COMPARATOR     
b         |    IDENTIFIER     
)         |    DELIMITER      
then      |    KEYWORD        
return    |    KEYWORD        
(         |    DELIMITER      
gcd       |    IDENTIFIER     
(         |    DELIMITER      
a         |    IDENTIFIER     
-         |    MATH_OPERATOR  
b         |    IDENTIFIER     
,         |    DELIMITER      
b         |    IDENTIFIER     
)         |    DELIMITER      
)         |    DELIMITER      
else      |    KEYWORD        
return    |    KEYWORD        
(         |    DELIMITER      
gcd       |    IDENTIFIER     
(         |    DELIMITER      
a         |    IDENTIFIER     
,         |    DELIMITER      
b         |    IDENTIFIER     
-         |    MATH_OPERATOR  
a         |    IDENTIFIER     
)         |    DELIMITER      
)         |    DELIMITER      
fi        |    KEYWORD        
;         |    DELIMITER      
fed       |    KEYWORD        
;         |    DELIMITER      
print     |    IDENTIFIER     
gcd       |    IDENTIFIER     
(         |    DELIMITER      
21        |    INTEGER        
,         |    DELIMITER      
15        |    INTEGER        
)         |    DELIMITER      
.         |    END_PROGRAM  

Here is the user's input for you to tokenize. ${userInput}`,
    });
    return response.output_text;
  }
  async function SyntaxAnalysis() {
    const client = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // Required for browser use
    });
    const response = await client.responses.create({
      model: "o1-2024-12-17",
      input: `
      You are a syntax analysis program. Your goal is to analyze a token stream generated from custom grammar code. You must check the order of tokens and identify any syntax errors based on the rules below.  
You should only output syntax errors (one per line) in the following format:
    syntax error found [lexeme it involves] [error details]
If there are no errors, output exactly:
    no syntax errors found all tokens matched

## IMPORTANT RULES:
1. **Brackets for Certain Constructs:**  
   - The keywords "if", "while", and function declarations or calls must always include brackets "()" around their conditions or parameter lists.
    - only worry if something is a function declaration if it is given the word def or seems to resemble a function call.
     -The program must end in a period
    2. **Program Termination:**  
   - The program must end with a single period (.) token.  
   - The final token in the token stream must be a period, with no tokens following it.  
   - If the period is missing, or if any tokens follow the period, report an error.
   - tokens are allowed to exist before a period
   - Note a token is a word in the given user Input

3. **Variable Declarations:**  
   - Every variable must be declared using only "int" or "double".
    - A variable being assigned a variable without being declared is NOT a syntax error, ignore it. 

4. **Keyword Expectations:**  
   - The keyword "do" must appear after a "while" statement.  
   - The keyword "then" must appear after an "if" statement.
   - Function declarations follow the following order: def type name(parameters) example: def int x(int y, double a)
   -def ends with fed, if goes to then and might go to else and ends with fi. while goes to do which goes to od.
   - if and while both go to parameters with expression declarations.
   -Note the keywords int and double are the type declarations for variables and are valid.
    - else does not have to follow an if it is completely optional and does not cause a syntax error.
    - there should not be a ; after a return statemtnt
5. **Output Restrictions:**  
   - Do not include any quotation marks (either single ' or double ") in your output.
   - Only state no syntax errors if there really are no syntax errors. Else output errors

6. **Other Considerations:**  
   - Unused assignments or declared-but-not-used variables are not considered syntax errors.
    - fed fi and other words must be followed by a ; see below for more context
   -return and function call can baloon out into big statements where it can return a function call for example return(function(1,2)) this is completely valid as long as each open bracket has a close bracket eventually 
    Analyze the given valid code examples and use it to compare with the user input. The given code has zero syntax errors. Use it to identify patterns in syntax analysis
## VALID CODE EXAMPLES:

### Valid Code Example 1:
      int x,i;
x=0;i=1;
while(i<10) do
	x = x+i*i; i=i+1
od;
print(x);.
##Valid Code2:
      int a,b,r;
a=21; b=15;
while (b<>0) do
	r = a % b;
	a=b;
	b=r;
od;
print(a). 
##Valid Code3:
double s;
def double f(double x, double y)
	double a;
	a=x+y*y;
	return(a)
fed;
s=f(2.4,1)+f(1.3,-2.4)
print(s).

    The only thing you return are syntax errors, if there are no syntax errors then output "no syntax errors found all tokens matched"
    If there are syntax errors then output the error on a new line in this form


    symtax error involving [lexeme] [information on why it is a syntax error]

    ${userInput}`,
    });
    return response.output_text;
  }
  async function Compile() {
    setErrors("");
    errorLog = "";
    console.log("Running compile function");
    var answer = await LexicalAnalysis();
    console.log(`Asked chat and got: ${answer}`);
    setErrors(errorLog + answer);
    answer = await TokenStream();
    setTokens(answer);
    answer = await SyntaxAnalysis();
    console.log(`Asked chat and got: ${answer}`);
    setErrors(errorLog + "\n" + answer);
  }
  return (
    <appModel.Provider
      value={{
        errorLog,
        userInput,
        tokens,
        symTable,
        assembly,
        setInput,
        Compile,
        setErrors,
      }}
    >
      {children}
    </appModel.Provider>
  );
};
export default AppManager;
