local ____lualib = require("lualib_bundle")
local __TS__ArrayIncludes = ____lualib.__TS__ArrayIncludes

local function includesWeb(collisionMap, type1, type2)
	return __TS__ArrayIncludes(collisionMap[type1], type2)
end

local function aggregate(collidesWith)
	return collidesWith
end

return {includes = includesWeb, aggregate = aggregate}