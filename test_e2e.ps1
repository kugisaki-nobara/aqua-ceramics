$baseUrl = "http://localhost:3000"
Write-Output "--- 1. Testing Health Endpoint ---"
$health = Invoke-RestMethod -Uri "$baseUrl/api/health"
Write-Output "Health: $($health.status) - $($health.company) - Tagline: $($health.tagline)"

Write-Output "`n--- 2. Testing SPA Route Serving (HTTP 200 checks) ---"
$routes = @("/", "/about", "/products", "/products/1", "/bathroom-3d", "/projects", "/partners", "/contact", "/request-quote", "/cart", "/checkout", "/track-order", "/login", "/register", "/account", "/admin", "/admin/login")
foreach ($r in $routes) {
    $res = Invoke-WebRequest -Uri "$baseUrl$r"
    Write-Output "Route $r -> Status Code: $($res.StatusCode)"
}

Write-Output "`n--- 3. Testing Products API ---"
$prods = Invoke-RestMethod -Uri "$baseUrl/api/products"
Write-Output "Total Products: $($prods.products.Count)"

Write-Output "`n--- 4. Testing Placing a Real Order ---"
$orderBody = '{"customer_name":"Shriram Sharma","customer_phone":"9876543210","customer_email":"shriram@example.com","address":"Plot 88, Palm Grove","city":"Bangalore","state":"Karnataka","postal_code":"560034","notes":"Deliver before 5 PM","payment_method":"bank_transfer","items":[{"product_id":1,"quantity":1}]}'

$newOrder = Invoke-RestMethod -Uri "$baseUrl/api/orders" -Method Post -Body $orderBody -ContentType "application/json"
$ordId = if ($newOrder.order.id) { $newOrder.order.id } else { $newOrder.order.order_id }
Write-Output "Order Placed! ID: $ordId, Ref: $($newOrder.order.order_ref), Status: $($newOrder.order.order_status), Amount: Rs.$($newOrder.order.total_amount)"

Write-Output "`n--- 5. Testing Order Tracking with 6-Stage Timeline ---"
$track = Invoke-RestMethod -Uri "$baseUrl/api/orders/track/$($newOrder.order.order_ref)"
Write-Output "Tracked Order: $($track.order.order_ref)"
Write-Output "Current Status: $($track.order.order_status)"
Write-Output "History Logs: $($track.order.history.Count) event(s)"

Write-Output "`n--- 6. Testing Quotation Submission ---"
$quoteBody = '{"product_id":1,"product_name":"Aqua Royale Rimless EWC","quantity":25,"customer_name":"Mehta Constructions (B2B)","customer_phone":"7019254016","customer_email":"procurement@mehtaconstructions.in","message":"Bulk order for 25 units for hotel project in Goa"}'

$quote = Invoke-RestMethod -Uri "$baseUrl/api/quotations" -Method Post -Body $quoteBody -ContentType "application/json"
Write-Output "Quotation Created! Ref: $($quote.quotation.quote_ref), Status: $($quote.quotation.status)"

Write-Output "`n--- 7. Testing Admin Authentication & Dashboard Metrics ---"
$adminLoginBody = '{"email":"admin","password":"AquaAdmin2026!"}'

$adminAuth = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json"
Write-Output "Admin Login: Token received for $($adminAuth.user.name) (Role: $($adminAuth.user.role))"

$headers = @{ Authorization = "Bearer $($adminAuth.token)" }
$metrics = Invoke-RestMethod -Uri "$baseUrl/api/admin/metrics" -Headers $headers
Write-Output "Metrics -> Revenue: Rs.$($metrics.metrics.totalRevenue), Orders: $($metrics.metrics.totalOrders), Quotations: $($metrics.metrics.totalQuotations)"

Write-Output "`n--- 8. Testing Admin Order Status Transition ---"
$statusUpdateBody = '{"status":"Dispatched from Depot","tracking_number":"AQUA-EXP-CRATE-9921","notes":"Quality check passed. Dispatched via container linehaul."}'

$updateRes = Invoke-RestMethod -Uri "$baseUrl/api/admin/orders/$ordId/status" -Method Put -Body $statusUpdateBody -ContentType "application/json" -Headers $headers
Write-Output "Status Updated: $($updateRes.success) - $($updateRes.message)"

Write-Output "`n--- 9. Verifying Live Order Tracking After Transition ---"
$reTrack = Invoke-RestMethod -Uri "$baseUrl/api/orders/track/$($newOrder.order.order_ref)"
Write-Output "Updated Order Status: $($reTrack.order.order_status)"
Write-Output "Tracking Docket: $($reTrack.order.tracking_number)"
Write-Output "History Events: $($reTrack.order.history.Count)"
foreach ($h in $reTrack.order.history) {
    Write-Output "  -> [$($h.status)] Note: $($h.notes) at $($h.created_at)"
}
