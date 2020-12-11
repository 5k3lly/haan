# i guess replace `gabor` and `gab` with $1 and $2?
ng new gabor -s -t -p gab --directory ng
cd ng

ng generate component fretboard -t -s
ng generate component circle-of-fifths -t -s
ng generate component bottom-drawer -t -s
ng generate component chords-box -t -s
ng generate component interval-gauge -t -s

ng generate service key
ng generate service fretboard

ng add @angular/material
