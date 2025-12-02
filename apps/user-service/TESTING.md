# Testing User Service

## 🚀 Chạy Tests

### Cách 1: Script (Khuyên dùng)
```bash
./run-tests.sh
```

### Cách 2: Docker Compose
```bash
# Từ root project
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit

# Cleanup
docker compose -f docker-compose.test.yml down --volumes
```

## 📊 Kết quả mong đợi

```
======================== 58 passed in ~20s =========================
Coverage: 97.52%
```

## 📁 Files quan trọng

- `pytest.ini` - Cấu hình pytest
- `tests/` - Test cases
- `docker-compose.test.yml` - Test environment (ở root)
- `run-tests.sh` - Script chạy tests
