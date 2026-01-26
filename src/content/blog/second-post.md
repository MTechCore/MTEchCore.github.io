
---

### 12. `src/content/blog/second-post.md`

```markdown
---
title: "Настройка HomeLab: первые шаги"
description: "Заметки о том, как я собирал домашний сервер. Docker, Proxmox и куча граблей."
pubDate: 2024-01-20
tags: ["homelab", "docker", "self-hosted"]
draft: false
---

Давно хотел поднять домашний сервер. Наконец дошли руки!

## Что использую

Пока что набор минимальный:

| Сервис | Назначение |
|--------|------------|
| Proxmox | Гипервизор |
| Docker | Контейнеризация |
| Nginx Proxy Manager | Реверс-прокси |
| Portainer | Управление контейнерами |

## Первые грабли

Конечно, без проблем не обошлось:

1. **Сеть** — настройка bridge в Proxmox это отдельное приключение
2. **SSL** — Let's Encrypt + wildcard сертификаты
3. **Бэкапы** — чуть не потерял конфиги (теперь всё в Git)

## Docker Compose пример

```yaml
version: "3.8"
services:
  portainer:
    image: portainer/portainer-ce:latest
    container_name: portainer
    restart: unless-stopped
    ports:
      - "9000:9000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data

volumes:
  portainer_data:
