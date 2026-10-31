# 4ThePrice - Subscriptions for Daily Life Demo Seeder
# Seeds realistic everyday subscriptions, customers, plans, meters, wallets, and invoices.

param (
    [string]$BaseUrl = "http://localhost:8080/v1",
    [string]$ApiKey = "sk_local_flexprice_test_key"
)

$headers = @{
    "x-api-key" = $ApiKey
    "Content-Type" = "application/json"
}

function Api-Post($path, $body) {
    $json = $body | ConvertTo-Json -Depth 10
    try {
        $resp = Invoke-RestMethod -Uri "$BaseUrl$path" -Method Post -Headers $headers -Body $json
        return $resp
    } catch {
        Write-Host "POST $path failed: $($_.Exception.Message)" -ForegroundColor Yellow
        return $null
    }
}

function Api-Get($path) {
    try {
        $resp = Invoke-RestMethod -Uri "$BaseUrl$path" -Method Get -Headers $headers
        return $resp
    } catch {
        Write-Host "GET $path failed: $($_.Exception.Message)" -ForegroundColor Yellow
        return $null
    }
}

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "4ThePrice: Seeding 'Subscriptions for Daily Life'" -ForegroundColor Cyan
Write-Host "Target API: $BaseUrl" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Create Features for Daily Life
Write-Host "`n1. Creating Daily Life Features..." -ForegroundColor Green
$features = @(
    @{ name = "Artisan Coffee Bar Access"; lookup_key = "feat_coffee_bar"; type = "boolean"; description = "Unlimited barista-crafted coffee and espresso at partner cafes" },
    @{ name = "24/7 Gym & Studio Access"; lookup_key = "feat_gym_247"; type = "boolean"; description = "Full access to cardio, weights, and group workout sessions" },
    @{ name = "City Metro & Transit Trips"; lookup_key = "feat_transit_trips"; type = "metered"; description = "Subway, light rail, and local transit rides" },
    @{ name = "Priority Grocery Delivery"; lookup_key = "feat_grocery_priority"; type = "boolean"; description = "1-hour delivery windows on daily pantry items" },
    @{ name = "Daily Life Cloud Storage"; lookup_key = "feat_cloud_storage"; type = "metered"; description = "2TB cloud photo and document synchronization" }
)

$featureMap = @{}
foreach ($f in $features) {
    $res = Api-Post "/features" $f
    if ($res) {
        $featureMap[$f.lookup_key] = $res.id
        Write-Host "  + Feature created: $($f.name) (ID: $($res.id))" -ForegroundColor Gray
    }
}

# 2. Create Meters for Daily Life Usage
Write-Host "`n2. Creating Usage Meters..." -ForegroundColor Green
$meters = @(
    @{ name = "Coffee Cups Redeemed"; event_name = "coffee_cup_redeemed"; aggregation = @{ type = "COUNT" } },
    @{ name = "Metro Transit Rides"; event_name = "metro_ride_taken"; aggregation = @{ type = "COUNT" } },
    @{ name = "Daily Delivery Orders"; event_name = "daily_order_placed"; aggregation = @{ type = "COUNT" } }
)

$meterMap = @{}
foreach ($m in $meters) {
    $res = Api-Post "/meters" $m
    if ($res) {
        $meterMap[$m.event_name] = $res.id
        Write-Host "  + Meter created: $($m.name) (ID: $($res.id))" -ForegroundColor Gray
    }
}

# 3. Create Pricing Plans
Write-Host "`n3. Creating Daily Life Plans..." -ForegroundColor Green
$plans = @(
    @{
        name = "Coffee Club Daily"
        lookup_key = "plan_coffee_daily"
        description = "Your morning routine perfected. 30 craft coffee cups per month with discounted top-ups."
        invoice_cadence = "in_advance"
    },
    @{
        name = "Anytime Fitness 24/7"
        lookup_key = "plan_gym_anytime"
        description = "Unlimited anytime gym access with sauna, locker access, and guest privileges."
        invoice_cadence = "in_advance"
    },
    @{
        name = "Daily Commuter Pass"
        lookup_key = "plan_transit_commuter"
        description = "60 monthly transit trips across subway, bus, and light rail network."
        invoice_cadence = "in_advance"
    },
    @{
        name = "Daily Life All-in-One"
        lookup_key = "plan_daily_life_bundle"
        description = "Coffee + Gym + Transit + Priority Grocery delivery bundled into one seamless daily subscription."
        invoice_cadence = "in_advance"
    }
)

$planMap = @{}
foreach ($p in $plans) {
    $res = Api-Post "/plans" $p
    if ($res) {
        $planMap[$p.lookup_key] = $res.id
        Write-Host "  + Plan created: $($p.name) (ID: $($res.id))" -ForegroundColor Gray
        
        # Attach recurring flat price
        $priceAmount = switch ($p.lookup_key) {
            "plan_coffee_daily" { "30.00" }
            "plan_gym_anytime" { "45.00" }
            "plan_transit_commuter" { "50.00" }
            "plan_daily_life_bundle" { "110.00" }
        }
        
        $priceReq = @{
            amount = $priceAmount
            currency = "USD"
            entity_type = "plan"
            entity_id = $res.id
            type = "recurring"
            billing_period = "monthly"
            billing_period_count = 1
            billing_model = "flat_fee"
            display_name = "$($p.name) - Base Membership"
        }
        $priceRes = Api-Post "/prices" $priceReq
        if ($priceRes) {
            Write-Host "    - Base price: `$$priceAmount/mo attached" -ForegroundColor DarkGray
        }
    }
}

# 4. Create Promotional Coupons
Write-Host "`n4. Creating Promotional Coupons..." -ForegroundColor Green
$coupons = @(
    @{
        name = "Daily Life Welcome Discount"
        code = "WELCOME20"
        type = "percentage"
        amount = "20"
        currency = "USD"
        max_redemptions = 500
        duration = "repeating"
        duration_in_months = 3
    },
    @{
        name = "New Subscriber \$5 Off"
        code = "DAILY5OFF"
        type = "fixed"
        amount = "5.00"
        currency = "USD"
        max_redemptions = 1000
        duration = "once"
    }
)

foreach ($c in $coupons) {
    $res = Api-Post "/coupons" $c
    if ($res) {
        Write-Host "  + Coupon created: $($c.code) ($($c.name))" -ForegroundColor Gray
    }
}

# 5. Create Customers
Write-Host "`n5. Creating Subscribers..." -ForegroundColor Green
$subscribers = @(
    @{ name = "Sarah Jenkins"; email = "sarah.jenkins@example.com"; external_id = "cust_daily_01" },
    @{ name = "David Chen"; email = "david.chen@example.com"; external_id = "cust_daily_02" },
    @{ name = "Elena Rostova"; email = "elena.rostova@example.com"; external_id = "cust_daily_03" },
    @{ name = "Marcus Brody"; email = "marcus.brody@example.com"; external_id = "cust_daily_04" }
)

$subscriberMap = @{}
foreach ($s in $subscribers) {
    $res = Api-Post "/customers" $s
    if ($res) {
        $subscriberMap[$s.external_id] = $res.id
        Write-Host "  + Subscriber registered: $($s.name) <$($s.email)> (ID: $($res.id))" -ForegroundColor Gray
        
        # Create a wallet for the customer with starter credits
        $walletReq = @{
            customer_id = $res.id
            currency = "USD"
            name = "$($s.name)'s Daily Life Wallet"
        }
        $walletRes = Api-Post "/wallets" $walletReq
        if ($walletRes) {
            Write-Host "    - Wallet created: $($walletRes.id)" -ForegroundColor DarkGray
            
            # Top-up wallet
            $topupAmount = switch ($s.external_id) {
                "cust_daily_01" { 50.00 }
                "cust_daily_02" { 35.00 }
                "cust_daily_03" { 100.00 }
                default { 25.00 }
            }
            $topupReq = @{
                walletId = $walletRes.id
                amount = $topupAmount
                currency = "USD"
                description = "Starter promotional credit grant"
            }
            $topupRes = Api-Post "/wallets/$($walletRes.id)/top-up" $topupReq
            if ($topupRes) {
                Write-Host "    - Preloaded with `$$topupAmount starter balance" -ForegroundColor DarkGreen
            }
        }
    }
}

# 6. Create Subscriptions
Write-Host "`n6. Creating Active Daily Subscriptions..." -ForegroundColor Green
if ($subscriberMap["cust_daily_01"] -and $planMap["plan_coffee_daily"]) {
    $sub1 = @{
        customer_id = $subscriberMap["cust_daily_01"]
        plan_id = $planMap["plan_coffee_daily"]
        start_date = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        currency = "USD"
    }
    $res1 = Api-Post "/subscriptions" $sub1
    if ($res1) {
        Write-Host "  + Sarah Jenkins subscribed to Coffee Club Daily" -ForegroundColor Cyan
    }
}

if ($subscriberMap["cust_daily_02"] -and $planMap["plan_transit_commuter"]) {
    $sub2 = @{
        customer_id = $subscriberMap["cust_daily_02"]
        plan_id = $planMap["plan_transit_commuter"]
        start_date = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        currency = "USD"
    }
    $res2 = Api-Post "/subscriptions" $sub2
    if ($res2) {
        Write-Host "  + David Chen subscribed to Daily Commuter Pass" -ForegroundColor Cyan
    }
}

if ($subscriberMap["cust_daily_03"] -and $planMap["plan_daily_life_bundle"]) {
    $sub3 = @{
        customer_id = $subscriberMap["cust_daily_03"]
        plan_id = $planMap["plan_daily_life_bundle"]
        start_date = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        currency = "USD"
    }
    $res3 = Api-Post "/subscriptions" $sub3
    if ($res3) {
        Write-Host "  + Elena Rostova subscribed to Daily Life All-in-One" -ForegroundColor Cyan
    }
}

if ($subscriberMap["cust_daily_04"] -and $planMap["plan_gym_anytime"]) {
    $sub4 = @{
        customer_id = $subscriberMap["cust_daily_04"]
        plan_id = $planMap["plan_gym_anytime"]
        start_date = (Get-Date).AddMonths(-1).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        currency = "USD"
    }
    $res4 = Api-Post "/subscriptions" $sub4
    if ($res4) {
        Write-Host "  + Marcus Brody subscribed to Anytime Fitness 24/7" -ForegroundColor Cyan
    }
}

Write-Host "`n=========================================" -ForegroundColor Green
Write-Host "4ThePrice Seeding Complete!" -ForegroundColor Green
Write-Host "Subscriptions, Customers, Wallets, and Plans are ready." -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

