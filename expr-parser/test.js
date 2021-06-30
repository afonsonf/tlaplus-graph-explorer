var parser = require("./parser").parser;

console.log(parser.parse("{2AS, AS2, AS_2AS, 3, -15, FALSE}"))
console.log(parser.parse("{}"))
console.log(parser.parse("<<3,asd>>"))
console.log(parser.parse("<< >>"))
console.log(parser.parse("15"))
console.log(parser.parse("\"crash asd mon\""))


console.log("")


console.log(parser.parse("(m1 :> 0 @@ m2 :> 0 @@ m3 :> 0)"))

console.log(parser.parse("( m1 :> (m1 :> <<>> @@ m2 :> <<>> @@ m3 :> <<>>) @@\
                            m2 :> (m1 :> <<>> @@ m2 :> <<>> @@ m3 :> <<>>) @@\
                            m3 :> (m1 :> <<>> @@ m2 :> <<>> @@ m3 :> <<>>) )"))
a = parser.parse("(m1 :>\
                      (m1 :> <<>> @@\
                       m2 :> <<[first_committed |-> 0, last_committed |-> 0, from |-> m1, dest |-> m2, type |-> OP_COLLECT, pn |-> 101]>> @@\
                       m3 :> <<[first_committed |-> 0, last_committed |-> 0, from |-> m1, dest |-> m3, type |-> OP_COLLECT, pn |-> 101]>>) @@\
                   m2 :> \
                      (m1 :> <<>> @@\
                       m2 :> <<>> @@\
                       m3 :> <<>>) @@\
                   m3 :>\
                      (m1 :> <<>> @@\
                       m2 :> <<>> @@\
                       m3 :> <<>>))")

console.log(a)
console.log(a.get('m1').get('m2'))

a = parser.parse("\
<< <<allen, \"p_change_status_load\">>,\
   <<allen, \"p_change_status4\">>,\
   <<allen, \"p_change_status_exit\">>,\
   <<jorge, \"p_allocate_load\">>,\
   <<jorge, \"f_is_accepted_call\">>,\
   <<jorge, \"f_is_accepted5\">>,\
   <<jorge, \"f_is_accepted8\">> >>\
")

console.log(a)
