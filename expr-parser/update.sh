#!/bin/bash

jison parser.jison

cp parser.js ../src/lib

cp parser.js ../examples/ceph-consensus/src/lib
cp parser.js ../examples/ceph-consensus-3mon/src/lib
cp parser.js ../examples/missionaries-and-cannibals/src/lib
