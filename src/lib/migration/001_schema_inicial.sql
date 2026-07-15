-- ========================================
-- BLOCO 1 — tabelas sem dependências
-- ========================================

-- Função para atualizar updated_at automaticamente
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Clientes
create table clientes (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  codigo      text unique,
  tag         text,
  contato     text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
create trigger trg_clientes before update on clientes
  for each row execute function update_updated_at();

-- Produtos
create table produtos (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  preco_venda numeric not null,
  ativo       boolean not null default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
create trigger trg_produtos before update on produtos
  for each row execute function update_updated_at();

-- Ingredientes
create table ingredientes (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null,
  unidade         text not null,
  estoque_minimo  numeric,
  ativo           boolean not null default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create trigger trg_ingredientes before update on ingredientes
  for each row execute function update_updated_at();

-- Fornecedores
create table fornecedores (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  contato     text,
  documento   text,
  created_at  timestamptz default now(),
  updated_at