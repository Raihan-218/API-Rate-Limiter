local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local requested = tonumber(ARGV[3])

local time = redis.call('TIME')
local now = tonumber(time[1]) + (tonumber(time[2]) / 1000000)
local bucket = redis.call('HMGET', KEYS[1], 'tokens', 'timestamp')
local tokens = tonumber(bucket[1])
local timestamp = tonumber(bucket[2])

if not tokens or not timestamp then
    tokens = capacity
    timestamp = now
end

tokens = math.min(capacity, tokens + ((now - timestamp) * refillRate))
local allowed = tokens >= requested
local retryAfter = 0

if allowed then
    tokens = tokens - requested
elseif refillRate > 0 then
    retryAfter = math.ceil((requested - tokens) / refillRate)
end

redis.call('HSET', KEYS[1], 'tokens', tokens, 'timestamp', now)
redis.call('EXPIRE', KEYS[1], math.max(1, math.ceil(capacity / refillRate)))

return { allowed and 1 or 0, tokens, retryAfter }