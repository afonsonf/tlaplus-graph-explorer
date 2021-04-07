/* lexical grammar */
%lex
%%

\s+     /* skip whitespace */
'{'     return '{';
'}'     return '}';
'('     return '(';
')'     return ')';
'['     return '[';
']'     return ']';
'<<'    return '<<';
'>>'    return '>>';
'@@'    return '@@';
':>'    return ':>';
'|->'   return '|->';
','     return ',';
'-'     return '-';
'TRUE'  return 'TRUE';
'FALSE' return 'FALSE';

'"'.*'"'                           return 'STRING';
[a-zA-Z0-9_]*[a-zA-Z][a-zA-Z0-9_]* return 'NameChar';
[0-9]+                             return 'Numeral';

/lex

/* operator associations and precedence */
%left ':>' '@@'
%left ',' '|->'

%start Main

%% /* language grammar */

Main : Expression {return $1};

Expression
  : Set              {$$ = $1;}
  | Sequence         {$$ = $1;}
  | '(' Function ')' {$$ = $2;}
  | '[' Record ']'   {$$ = $2;}
  | Bool             {$$ = $1;}
  | Value            {$$ = $1;}
  | Integer          {$$ = $1;}
  ;

Expressions
  : Expressions ',' Expression
    {
      $1.push($3);
      $$ = $1;
    }
  | Expression
    {$$ = [$1];}
  ;

Set
  : '{' Expressions '}'
    {
      $$ = new Set();
      for(v of $2) $$.add(v);
    }
  | '{''}'
    {$$ = new Set();}
  ;

Sequence
  : '<<' Expressions '>>'
    {$$ = $2;}
  | '<<' '>>'
    {$$ = [];}
  ;

Function
  : Function '@@' Function
  {
    for([x,y] of $3) $1.set(x,y);
    $$ = $1;
  }
  | Value ':>' Expression
    {
      $$ = new Map();
      $$.set($1,$3);
    }
  ;

Record
  : Record ',' Record
    {
      for(x in $3) $1[x] = $3[x];
      $$ = $1;
    }
  | Value '|->' Expression
    {
      $$ = {}
      $$[$1] = $3;
    }
  ;

Bool
  : 'TRUE'  {$$ = true;}
  | 'FALSE' {$$ = false;}
  ;

Value
  : NameChar
    {$$ = yytext;}
  | STRING
    {$$ = yytext}
  ;

Integer
  : '-' Numeral
    {$$ = -Number(yytext);}
  | Numeral
    {$$ = Number(yytext);}
  ;
