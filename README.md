# ⚽ CanchaSync - Multi-tenant SaaS for Sports Complexes

![CanchaSync Hero](/apps/frontend/public/assets/landing_bg.png)

**CanchaSync** is a premium, high-performance SaaS platform designed for the modern management of soccer complexes. Built with a robust multi-tenant architecture, it allows complex owners to digitize their bookings, manage payments, and scale their business with ease.

---

## 🚀 Core Features

- **🛡️ Multi-tenant Infrastructure:** Secure and isolated data for every sports complex.
- **💎 Subscription Management:** Integrated plan system (Gratis, Básico, Premium) with trial periods.
- **🎨 AI-Powered Landing Page:** Elegant, high-conversion public face with cinematic visuals.
- **⚡ Fluid UI/UX:** Smooth transitions, micro-animations, and custom elegant modals.
- **📊 Advanced Dashboards:** 
  - **SuperAdmin:** Global control of tenants, plans, and revenue.
  - **TenantAdmin:** Manage canchas, reservations, and complex profile.
- **🔐 Secure Auth:** Powered by BetterAuth with role-based access control (RBAC).
- **📱 Responsive Design:** Fully optimized for desktop and mobile devices.

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js 15+](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [BetterAuth](https://www.better-auth.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Styling:** Premium Glassmorphism & Fluid Animations

---

## 📦 Project Structure

```bash
CanchaFutbolSaas/
├── apps/
│   └── frontend/          # Next.js web application
├── packages/
│   └── database/          # Prisma schema and migrations
├── .gitignore             # Git exclusion rules
├── package.json           # Monorepo configuration
└── README.md              # You are here!
```

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/CanchaFutbolSaas.git
   cd CanchaFutbolSaas
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root and add your credentials:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/canchasync"
   BETTER_AUTH_SECRET="your-secret-here"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

4. **Initialize Database:**
   ```bash
   npx prisma db push
   # Optional: Seed initial plans
   node packages/database/seed-plans.js
   ```

5. **Run Development Server:**
   ```bash
   npm run dev
   ```

---

## 📸 Preview

| Landing Page | Admin Dashboard |
| :--- | :--- |
| ![Landing](/apps/frontend/public/assets/landing_bg.png) | ![Dashboard](/apps/frontend/public/logo.png) |

---

## 🎓 Curso: Experiencia Formativa V - Proyecto Final

Este repositorio alberga el proyecto de desarrollo de software para el curso **Experiencia Formativa V**.

### 👥 Integrantes:
* 👤 **Juan**
* 👤 **Jose**
* 👤 **Miguel**

### 🗓️ Estado de Entregables del Proyecto:
* **[x] Entrega 1 – 31/05 (Capítulo 1):** Completado e implementado en el informe oficial.
* **[ ] Entrega 2 – 14/06 (Capítulo 2):** Planificado.
* **[ ] Entrega 3 – 28/06 (Capítulo 3):** Planificado.

El documento formal de avances del proyecto se encuentra en la siguiente ruta:
👉 [Informe_Proyecto_EF5.docx](file:///C:/GITHUB/CanchaFutbolSaas/Entregables/Informe_Proyecto_EF5.docx)

---

## 🤝 Contact

**José Ángel Espinoza**
📞 Phone: 975026835
🌐 Website: [canchasync.pro](http://localhost:3000)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Developed with ❤️ by **Antigravity AI**.
