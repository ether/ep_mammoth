var Token = require("./Token");
var StringSource = require("./StringSource");

exports.RegexTokeniser = RegexTokeniser;

function RegexTokeniser(rules) {
    rules = rules.map(function(rule) {
        return {
            name: rule.name,
            regex: new RegExp(rule.regex.source, "g")
        };
    });
    
    function tokenise(input, description) {
        var source = new StringSource(input, description);
        var index = 0;
        var tokens = [];
    
        while (index < input.length) {
            var nextToken = readNextToken(input, index, source);
            index += nextToken.value.length;
            tokens.push(nextToken);
        }
        
        tokens.push(endToken(input, source));
        return tokens;
    }

    function readNextToken(string, startIndex, source) {
        for (var i = 0; i < rules.length; i++) {
            var regex = rules[i].regex;
            regex.lastIndex = startIndex;
            var result = regex.exec(string);
            if (result && result.index === startIndex && result[0].length) {
                var value = result[0];
                return new Token(
                    rules[i].name,
                    value,
                    source.range(startIndex, startIndex + value.length)
                );
            }
        }
        return new Token(
            "unrecognisedCharacter",
            string.substring(startIndex, startIndex + 1),
            source.range(startIndex, startIndex + 1)
        );
    }
    
    function endToken(input, source) {
        return new Token(
            "end",
            null,
            source.range(input.length, input.length)
        );
    }
    
    return {
        tokenise: tokenise
    }
}


