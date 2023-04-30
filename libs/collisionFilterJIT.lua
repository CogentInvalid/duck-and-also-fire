local ____lualib = require("lualib_bundle")
local __TS__ArrayReduce = ____lualib.__TS__ArrayReduce

local function includesJIT(collisionMap, type1, type2)
	return (bit.band(type2, collisionMap[type1])) ~= 0
end

local function aggregate(collidesWith)
	return __TS__ArrayReduce(
        collidesWith,
        function(____, a, b) return bit.bor(a, b) end,
        0
    )
end

return {includes = includesJIT, aggregate = aggregate}