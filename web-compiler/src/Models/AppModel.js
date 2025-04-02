/* eslint-disable no-unused-vars */
import { createContext, useState } from "react";
import OpenAI from "openai";
export const appModel = createContext(null);

const AppManager = ({ children }) => {
  const [userInput, setInput] = useState(`def double f(int x, double y)
if(x == 10) then
int var;
var = 10 + 2;
fi;
fed;`);
  const [tokens, setTokens] = useState(`def       |    KEYWORD        
double    |    KEYWORD        
f         |    IDENTIFIER     
(         |    DELIMITER      
int       |    KEYWORD        
x         |    IDENTIFIER     
,         |    DELIMITER      
double    |    KEYWORD        
y         |    IDENTIFIER     
)         |    DELIMITER      
if        |    KEYWORD        
(         |    DELIMITER      
x         |    IDENTIFIER     
==        |    COMPARATOR     
10        |    INTEGER        
)         |    DELIMITER      
then      |    KEYWORD        
int       |    KEYWORD        
var       |    IDENTIFIER     
;         |    DELIMITER      
var       |    IDENTIFIER     
=         |    ASSGN_OPERATOR 
10        |    INTEGER        
+         |    MATH_OPERATOR  
2         |    INTEGER        
;         |    DELIMITER      
fi        |    KEYWORD        
;         |    DELIMITER      
fed       |    KEYWORD        
;         |    DELIMITER      
.         |    END_PROGRAM`);
  const [symTable, setTable] = useState(`Global Table:
| name | type   | return type | is function | number of parameters | parameters      |
|------|--------|-------------|-------------|----------------------|-----------------|
| f    | double | double      | True        | 2                    | integer, double |

Local Table: f
| name | type   |
|------|--------|
| x    | integer|
| y    | double |

Local Table: if0
| name | type    |
|------|---------|
| var  | integer `);
  const [header, setHeader] = useState("AI Compiler");
  let info = `Welcome to my AI Compiler!

**Diclaimer** The success rate of the error detection is pretty bad, but this project is more of an expirament 
and less of a legitimate attempt to get this fully functional.
Also I may or may not have made this to troll my professor.

Anyway.. Here's how to use this website.
The left box is where you can type in your own code, note this is a custom programming language but it is 
very similar to c. Once you've typed out your code hit the compile button and watch Chat GPT work it's 
hallucinogenic magic and populate the fields above.

Tokens: Shows the generated token stream
Symbols: Displays the global scope and local scope symbol tables used for semantic analysis
Assembly: Displays the converted code into Assembly.

How do you execute the code? Great question! Click on the link below, it will open up CPUlator, just copy and 
paste the assembly code in and watch it run!

Thanks for checking out this cursed project. Have fun!`;
  const [assembly, setAssembly] =
    useState(`.org 0x1000  // Start at memory location 1000
.text        // Code section
.global _start
_start:

// Store the input parameters into registers for x and y
ldr r0, =X;
ldr r1, [r0]

if0:  // Label for the first if block
cmp r1, #10        // Compare x with 10
bne fed            // If x is not 10, skip to the end

// Inside the if block
// Declaring and initializing var
ldr r2, =Var;
ldr r3, =12;       // 10 + 2 = 12
str r3, [r2]       // Store result in Var

fed:
// End of function
_stop:
b _stop

.data      // Initialized data section
X:
.word 0    // Placeholder for x
Var:
.word 0    // Placeholder for var
.end`);
  var [errorLog, setErrors] = useState("Errors will appear here:");
  function cleanReply(answer) {
    return answer.replace(/```[\w]*\n?/g, "").trim(); //remove ``` ```` from open ai replies
  }

  async function LexicalAnalysis() {
    setHeader("Running Lexical Analysis");
    const client = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // Required for browser use
    });
    const response = await client.responses.create({
      model: "gpt-4o",
      input: `
      You are a lexical analyzer. Your task is to analyze the user input **letter by letter**, without considering whole words. You must validate each character and classify it as valid or invalid based on a predefined set of characters. YOU DO NOT CARE ABOUT WHITESPACES. Also periods are a valid character. If you encounter a character that is **not allowed**, output a lexical error along with the line number where the error occurred (based on the number of newlines in the message). If no errors are found, simply output nothing.

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
7. The function has period "." built into it, this is a perfectly valid character and does not cause a lexical error.
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

### User Input:
Here is the input you need to analyze:
${userInput}`,
    });
    return response.output_text;
  }
  async function TokenStream() {
    setHeader("Generating Token Stream");
    const client = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // Required for browser use
    });
    const response = await client.responses.create({
      model: "gpt-4o",
      input: `You do not do conversational replies also do not reply with any quotation marks in your response. Your job is to read the user input word by word and tokenize it according to predefined categories. 
** Valid Characters ** Note a period is a valid character and it is a delimeter. Note module % is a valid character.
( ) [ ] 1 2 3 4 5 6 7 8 9 0 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z <> == <= >= > < + - * % ; , .
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
def, fed, if, fi, do, od, while, and, or, not, else, int, double, then, return, print

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
    setHeader(
      "Analyzing Syntax... This may take a while (30 seconds -> multiple minutes)"
    );
    const client = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // Required for browser use
    });
    const response = await client.responses.create({
      model: "o1-2024-12-17", //Use O1 this is too compicated for simple GPT (rip wallet)
      input: `
      You are a syntax analysis program. Your goal is to analyze a token stream generated from custom grammar code. You must check the order of tokens and identify any syntax errors based on the rules below.  
You should only output syntax errors (one per line) in the following format:
    syntax error found [lexeme it involves] [error details]
If there are no errors, output absolutely nothing.

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

## Input Output Examples:
Input:
def double(int x, double y)
int kaka = 100;
kaka = kaka * 100;
if(kaka % 2 == 0) then
 x = 100;
fi;
return 10.2;
fed;.
Output:
Syntax error found def double [missing function name in function declaration] 
Syntax error found return [missing brackets]
Syntax error found 10.2; [semicolon after return statement is not allowed]
##End of examples
    The only thing you return are syntax errors, if there are no syntax errors then output nothing
    If there are syntax errors then output the error on a new line in this form


    Syntax error found [lexeme] [information on why it is a syntax error]

    ${userInput}`,
    });
    return response.output_text;
  }
  async function SymbolTable() {
    setHeader("Generating Symbol Table");
    const client = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // Required for browser use
    });
    const response = await client.responses.create({
      model: "gpt-4o",
      input: `
      You are a symbol table generator for a compiler. Your task is to analyze the given code and create a scope table.
      Here is your task broken down:
      ##Global Table Information:
      - Every program will always have a global table.
      - Every entry in the global table will have all of the following columns[name, type, return type, is function, number of parameters, parameters,]
      - Heres a break down of the above information:
        -Name: variable/function name example int x has the name x or def double gcd has the name gcd.
        -Type: variable/function type, assume this will always be declared before the name of a variable, the type can only be interger or double
        -Return Type: this only matters for functions, if it's a variable it has the return type NULL. if it's a function then it's either integer or double as declared in the functions declaration (keyword before it's name)
        -Is Function: this is a True or False bool statement. If it's a variable (no def keyword) then it's False. If it is a function declaration then this is True
        -Number of Parameters: a integer value which is just a count of the parameters inside a function declaration. Example the function: def double f(int x, int y, int z) has the parameter count of 3.
        -Parameters: A list of keywords in the same order of the functions parameters which shows the type of each parametre. Example the function: def double f(int x, int y, double z) has the parameters: integer, integer, double
      - If a variable is defined inside a def -> fed statement than it is NOT added to the global table, it is instead added to this functions local table. More on this below.
      - Variables declared outside of def and fed. So either before the word def, or after the word fed, are added to the global table. Under no other circumstance can they be added to the global table.
        ##Local Table information:
      -Local tables can only hold variables, not function declarations. Nested function declarations are not allowed in this programming language, but don't worry about that or inform the user of that mistake if you spot it.
      - Whenever a function is declared it generates it's own local table, the name of the local table is therefore the functions name.
      - For a function, immediately all of it's declared parameters are entered into the local table.
      - The local table entries have the following information:
        - name: name of the variabele
        - type: the type (integer or double)
      -Again each local table is assigned a name based on the function name, but blocks of code, created by if, else, and while also create their own local tables.
        - Values inside the brackets of a if and double are not added to their local table unless they are defined in the brackets. Example if(x == y) then. The variables x and y are NOT added to the if local table
        - Additionally each block local table is given a name which is the block name (if, else, while) followed by an incrementing number which is a representation of how many if while and elses there have been. For example, the first if will be named if0 the second if will have it's local table named if1. Same applies for while and else
      ##Output:
      - Your output must be clean and organized, return the global table first and the local tables underneath of it.
      - Each varable or function in the global tables take up 1 row in the table. Each row in the global table has 6 columns. 
      - When printing out the global table please state Global Table: at the top, followed by the headers of the columns evenly spaced out. The headers are [name, type, return type, is function, number of parameters, parameters]
      - When printing out local tables please state the local table name ex: if0, followed by the tables headers [name, type]. Again each row is it's own variable.
      - You are only to output the tables, if no code is given just output the Global Table and it's headers with no variables inside of it.
      - If you spot any kind of error inside the user given code do not mention it, that is not your role. Just worry about constructing the tables and formating the output.
      - Be consistent with how you name the type. turn int into integer, and ensure double is always double.
      ##Output Format example follow his as closely as possible:
      Global Table:
      | name         | type    | return type | is function | number of parameters | parameters      |
      |--------------|---------|-------------|-------------|----------------------|-----------------|
      | x            | integer | NULL        | False       | 0                    | []              |
      | someFunction | double  | double      | True        | 2                    | double, integer |
      | testing      | double  | NULL        | False       | 0                    | []              |

      Local Table: someFunction
      | name | type   |
      |------|--------|
      | a    | double |
      | b    | integer|
      | huh  | integer|

      Local Table: if0
      | name  | type    |
      |-------|---------|
      | ifVar | integer |

      Local Table: else0
      | name  | type    |
      |-------|---------|

      ## End of explination
      Thoes are your instructions, here is the users input for you to do the above on:
${userInput}`,
    });
    return response.output_text;
  }
  async function SemanticAnalysis() {
    setHeader("Checking for Semantic Errors");
    const client = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // Required for browser use
    });
    const response = await client.responses.create({
      model: "gpt-4o",
      input: `
      You are a semantic analyzer for a compiler. You take in a symbol table, which has both global and local scope, aswell as the users code. You focus on ensuring strict type consistency, and checking the scope of variables and functions.
      ## Your task
      - Only return errors, if there are no errors simply return nothing
      - If you do find an error be specific about the issue for example: Type error involving return in function gcd, returning double instead of integer. Or for scope: Scope error variable x has not been defined.
      - If you look at the user code and see you're inside a function declaration then you may look at the local table associated with that fuction. The same carries for block statements such as if, while and else.
      - If you're not inside a block of code or a function you can only check if a function is defined inside the global scope. 
      - Going line by line through the user code is extremely important. A variable may exist inside the global table, but verify it exists before it was set to a value. The tables are generated before you run your analysis to just because the variable exists in the table does not nessesarily mean it has been properly defined
      - Seeting a undefined variable or calling an undefined function is a semantic error
      - defining a variable to a type and setting to a different type is a semantic error. Example int x; x = 1.1 (1.1 is a double not an integer)
      - Note a block inside an a function does have access to that functions local table variables. But the function does not have access to the variable defined inside the block. Blocks are if, while, and else.
      - Note block scope for a while loop ends once you see the word od.
      - Block scope for if and else ends when you see the word fi.
      -Note a double is a number with any decimal for example: 1.2, 1.0 etc. Treat numbers as the entire thing, do not go number by number.
      - A integer is a number with no decimal. Such as 1, 2, 123124, etc.
      -treat int and integer and double and double as the same. These are not type errors just the languages nuances.
      ## Rules about function calls
      - You need to ensure that functions are called properly.
      - You need to verify that the number of parameters passed to a function matches that functions paremeters count in the global table, if it doesn't that is a Semantic error.
      - You need to verify that the typing matches for each parameter, the order of parameters is extremely important. in the global table the parameters list shows the order and type of the parameter variables so compare thoes
      - if a variable is being set to a function verify that the variables return type is the same as that variabeles
      ## Rules to follow when inside a function
      - verify that the functions return is the same as it's return type. Example: def int gcd() return(1.1) fed; This is a semantic error 1.1 is a double not an integer invalud return type.
      - Verify that variables inside a function actually exist in it's scope (local and gloal table pertaining to this specific function).
      - If there is a block of code (if while else) inside a function which then calls return. Only compare the return value inside the brackets to the functions return type. Don't worry about block scope just look to the global table and ensure the return type value matches the functions return value.
      ##Overall rules:
      - Ensure type is strictly consisten. This means if you see a math operator like so: int a; a = 1 + 2 + 3 + 4; ensure that only integers are added. this means that a = 1 + 2.1 + 3 + 4; is a semantic error as there is a type mismatch between a and 2.1
      - Type consistency also applies in comparisons this being < > == <> <= >=. Type comparisons must be the same just as math operations must be the same
      ##Output
      -Only ever output the error, if not errors than return the success message defined above.
      -Do not seperate errors with a blank new line, keep the errors as close together as possible to keep it clean.
      -If there are not errors lierally output nothing. Not the word nothing just respond with a blank string.
      -If you somehow come to a conclusion like this: Type error involving return in function huh, returning double instead of double. That is not an error! return double instead of double is exactly what we want! This is not a semantic error! If you catch yourself making this mistake DO NOT OUTPUT THE ERROR. Just erase it. Thank you!
      ##Example:
      ##Input:
      testing = 10;
      int x;
      x = 10;
      def double someFunction(double a, int b)
      int huh;
      huh = 10;
      if(huh == 10) then
      int ifVar;
      return(1.1)
      else
      return (-100.2)
      fi;
      ifVar = 10;
      fed;
      double testing;
      huh = 1.2;.
      ##Output:
      Semantic error variable testing has not been defined.
      Scope error in function someFunction, ifVar does not exist outside if block.
      Type error assigning 1.2 to variable huh expected integer got double.
      Type error testing assigned to integer, expected double.

      ##Example:
      ##Input:
      def double test(int x, int y)
      return(10.1)
      fed;
      print(test(20, 100))
      .
      ##Output:

      ##Example 2:
      def double huh(int x, int y)
      return(10.1)
      fed;
      print(huh(20, 100))
      .
      Output:
      ##End of explination END OF EXAMPLES
##Symbol table from user code for you to analyze. Use only the above information to generate your output. The above explinations and examples are only exaples. Analyze this symbol table and user code:
${symTable}
##User Code:
${userInput}`,
    });
    return response.output_text;
  }
  async function GenerateAssembly() {
    setHeader("Generating Assembly Code");
    const client = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // Required for browser use
    });
    const response = await client.responses.create({
      model: "gpt-4o",
      input: `
      Your task is to take in the given user code and convert it into executable Assembly code. The processor information is: 
      ARMv7 generic containing a ARMv7 processor
      The goal is to create code which runs in CPUlator.
      ##Important information:
      if statements and else statements are converted into lables. The same goes for function names. use branching bl to jump to these code segments. More context in the below examples.
      if else and while lables need to be named by the block function (if else while) and their number for example (if0, if1, else0, while0) All label names end with a semicolon.
      Here is an example of working assembly code to help you translate:
      ##Output:
      -Only output the assembly code, do not output anything else.
      ##Working Assembly code:
      ##Example 1:
      .org 0x1000  // Start at memory location 1000
      .text        // Code section
      .global _start
      _start:

      // Copy data from memory to registers
      ldr r3, =A;
      ldr r0, [r3]
      ldr r3, =B;
      ldr r1, [r3]
      add r2, r1, r0
      // Copy data to memory
      ldr r3, =Result // Assign address of Result to r3
      str r2, [r3] // Store contents of r2 to address in r3
      // End program
      _stop:
      b _stop

      .data      // Initialized data section
      A: 
      .word 4
      B: 
      .word 8
      .bss     // Uninitialized data section
      Result:
      .space 4 // Set aside 4 bytes for result

      .end
      ##Example 2:
      .equ SIZE, 80
      .org 0x1000  // Start at memory location 1000
      .text        // Code section
      .global _start
      _start:

      mov    r3, #SIZE     // Set the maximum comparison length
      stmfd  sp!, {r3}     // Push the maximum length
      ldr    r3, =Second
      stmfd  sp!, {r3}     // Push the second string address
      ldr    r3, =First
      stmfd  sp!, {r3}     // Push the first string address
      bl     strncmp
      add    sp, sp, #12   // Release the parameter memory from stack

      // Result in r0
      _stop:
      b    _stop

      //-------------------------------------------------------
      strncmp:
      /*
      -------------------------------------------------------
      Determines if two strings are equal up to a max length (iterative)
      Equivalent of: strncmp(*str1, *str2, max_buffer_size)
      -------------------------------------------------------
      Parameters:
        str1 - address of first string
        str2 - address of second buffer
        max_buffer_size - maximum size of str1 and str2
      Returns:
        r0 - less than 0 if first string comes first,
            greater than 0 if first string comes second,
            0 if two strings are equal up to maximum length
      Uses:
        r1 - address of first string
        r2 - address of second string
        r3 - current maximum length
        r4 - character from first string
        r5 - character from second string
      -------------------------------------------------------
      */
      //=======================================================

      // prologue: save registers and get parameters from stack
      stmfd sp!, {fp, lr} //step one, pushing the fp and lr onto the stack
      mov fp, sp //Step two, moving the sp into the fp
      //Step 3, no local variables
      stmfd sp!, {r0-r5} //Step 4 preserving registers
      ldr r1, [fp, #8] //getting parameters from stack
      ldr r2, [fp, #12]
      ldr r3, [fp, #16]

      //=======================================================


      mov     r0, #0          // Initialize result to strings equal
      strncmpLoop:
      cmp     r3, #0
      beq     _strncmp        // Max length met - finish comparison
      ldrb    r4, [r1], #1    // Get character from first string
      ldrb    r5, [r2], #1    // Get character from second string
      cmp     r4, r5
      subne   r0, r4, r5      // Calculate difference between two characters if not the same
      bne     _strncmp        // Return difference if not the same
      cmp     r4, #0          // look for end of first string
      beq     _strncmp        // return if at end of string
      cmp     r5, #0          // look for end of second string
      beq     _strncmp        // return if at end of string
      sub     r3, r3, #1      // decrement max length count
      b       strncmpLoop

      _strncmp:

      //=======================================================

      // epilogue: clean up stack
      ldmfd sp!, {r0-r5} //Step 1 poping the preserved registers from the stack
      //Step 2, no local variables
      ldmfd sp!, {fp, pc} //Step 3, poping the fp and pc from the stack.
      //=======================================================

      //-------------------------------------------------------
      .data
      First:
      .asciz "aaaa"
      Second:
      .asciz "aaab"
      .end
      ##Example 3 (Printing to the UART, print function relies on peices of this code):
      .org 0x1000  // Start at memory location 1000
      .text        // Code section
      .global _start
      _start:
      mov    r1, #0 //initialize r1
      ldr    r2, =Data    // Store address of start of list
      ldr    r3, =_Data   // Store address of end of list

      Loop:
      ldr    r0, [r2], #4 // Read address with post-increment (r0 = *r2, r2 += 4)
      add    r1,r0,r1   // Add the value in the list to r1
      cmp    r3, r2       // Compare current address with end of list
      bne    Loop         // If not at end, continue

      _stop:
      b _stop

      .data
      .align
      Data:
      .word   4,5,-9,0,3,0,8,-7,12    // The list of data
      _Data: // End of list address
      .end
      ##Example 3:
      .equ SIZE, 20 // Size of string buffer storage (bytes)
      .org 0x1000   // Start at memory location 1000
      .text         // Code section
      .global _start
      _start:

      //=======================================================

      // your code here

      //=======================================================

      ldr    r4, =First
      bl    ReadString
      ldr    r4, =Second
      bl    ReadString
      ldr    r4, =Third
      bl     ReadString
      ldr    r4, =Last
      bl     ReadString

      _stop:
      b _stop

      // Subroutine constants
      .equ UART_BASE, 0xff201000  // UART base address
      .equ ENTER, 0x0A            // The enter key code
      .equ VALID, 0x8000          // Valid data in UART mask

      ReadString:
      /*
      -------------------------------------------------------
      Reads an ENTER terminated string from the UART.
      -------------------------------------------------------
      Parameters:
        r4 - address of string buffer
        r5 - size of string buffer
      Uses:
        r0 - holds character to print
        r1 - address of UART
      -------------------------------------------------------
      */
      stmfd sp!, {r0, r1, r4, r5}     // preserve temporary registers
      ldr   r1, =UART_BASE        // get address of UART
      rsLOOP:
      cmp r5, #SIZE       // Compare r5 to the max size of the Buffer.
      beq _ReadString    //We're at buffer size? Ok lets branch out.
      ldr  r0, [r1]      // read the UART data register
      tst  r0, #VALID    // check if there is new data
      beq  _ReadString   // if no data, exit subroutine
      strb r0, [r4]      // store the character in memory
      add  r4, r4, #1    // move to next byte in storage buffer
      add  r5, r5, #1    // add one to the current size of the string Buffer.
      b    rsLOOP     
      _ReadString:
      ldmfd sp!, {r0, r1, r4, r5}     // recover temporary registers
      bx    lr                    // return from subroutine
      //=======================================================

      // your code here

      //=======================================================

      bx    lr                    // return from subroutine

      .data
      .align
      // The list of strings
      First:
      .space  SIZE
      Second:
      .space SIZE
      Third:
      .space SIZE
      Last:
      .space SIZE
      _Last:    // End of list address
      .end
      ##End of examples
      ##Here is the user input to analyze
${userInput}`,
    });
    return response.output_text;
  }
  async function Compile() {
    setErrors("");
    errorLog = "";
    console.log("Running compile function");
    var answer = await LexicalAnalysis();
    answer = cleanReply(answer);
    console.log(`Asked chat and got: ${answer}`);
    setErrors(answer);
    answer = await TokenStream();
    answer = cleanReply(answer);
    setTokens(answer);
    answer = await SyntaxAnalysis();
    answer = cleanReply(answer);
    console.log(`Asked chat and got: ${answer}`);
    setErrors((prevErrors) => prevErrors + "\n" + answer);
    answer = await SymbolTable();
    answer = cleanReply(answer);
    console.log(`Asked chat and got: ${answer}`);
    setTable(answer);
    answer = await SemanticAnalysis();
    answer = cleanReply(answer);
    setErrors((prevErrors) => prevErrors + "\n" + answer);
    answer = await GenerateAssembly();
    answer = cleanReply(answer);
    setAssembly(answer);
    setHeader("Code Compiled! Hopefully it's correct!");
  }
  return (
    <appModel.Provider
      value={{
        errorLog,
        userInput,
        tokens,
        symTable,
        assembly,
        info,
        header,
        setInput,
        Compile,
        setErrors,
        setHeader,
        setTokens,
        setTable,
        setAssembly,
      }}
    >
      {children}
    </appModel.Provider>
  );
};
export default AppManager;
