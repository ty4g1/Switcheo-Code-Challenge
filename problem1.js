// ASSUMPTIONS

// Since the example given sum_to_n(5) sums integers from 1 to 5, smallest valid input is assumed to be 1


// Solution using formula for arithmetic progression
var sum_to_n_a = function(n) {
    return n * (n + 1) / 2;
};

// Solution using loop
var sum_to_n_b = function(n) {
    var sum = 0;
    for (i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// Solution using recursion
var sum_to_n_c = function(n) {
    return n === 1
            ? 1
            : n + sum_to_n_c(n - 1);
};

//TESTS
console.log(sum_to_n_a(5));
console.log(sum_to_n_b(5));
console.log(sum_to_n_c(5));

console.log(sum_to_n_a(10));
console.log(sum_to_n_b(10));
console.log(sum_to_n_c(10));
