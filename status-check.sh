#!/bin/bash

echo "📊 Schneller Status Check"
echo "========================"

echo "Container:"
docker compose ps

echo ""
echo "Website Test:"
curl -I http://walterbraun-muenchen.de 2>/dev/null | head -1 || echo "Website nicht erreichbar"

echo ""
echo "Letzte Container Logs:"
docker compose logs web --tail=5

echo "========================"