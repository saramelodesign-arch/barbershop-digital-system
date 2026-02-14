# MVP Scope

## 1. Multi-Tenant Base (pensado para SaaS)

- Cada barbearia tem:
  - id
  - name
  - email
  - phone
  - address
  - timezone

Todas as entidades devem pertencer a uma barbearia.

---

## 2. Business Configuration

- Opening hours (ex: 09:00–19:00)
- Closed days (ex: Sunday)
- Slot duration (default: 30 min)
- Cancellation window (ex: 24h before appointment)

Regras:
- Não permitir marcações fora do horário.
- Não permitir marcações em dias fechados.

---

## 3. Service Management (CRUD)

Cada serviço deve ter:
- id
- name
- duration (minutos)
- price
- isActive

Regras:
- Duração obrigatória
- Preço >= 0

---

## 4. Barber Management (CRUD)

Cada barbeiro deve ter:
- id
- name
- photo (opcional)
- active status

Opcional (mas recomendado já):
- Horário individual

---

## 5. Booking System

Cada marcação deve ter:
- id
- customerName
- customerPhone
- serviceId
- barberId
- startTime
- endTime
- status (scheduled, cancelled)

### Regras críticas:

1. Não pode haver sobreposição:
   - Mesmo barbeiro
   - Intervalos que colidem

2. startTime + duration = endTime

3. Cancelamento:
   - Só permitido até X horas antes
   - Após isso → erro

4. Só permitir marcação:
   - Dentro do horário do negócio
   - Dentro do horário do barbeiro
   - Em slot válido

---

## 6. Admin Access (simples)

- Login básico
- Apenas admin da barbearia pode gerir dados
