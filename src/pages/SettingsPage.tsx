
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">Gerencie as configurações do sistema.</p>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="printer">Impressora</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Estabelecimento</CardTitle>
              <CardDescription>
                Configurações gerais do seu negócio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Nome do Estabelecimento</Label>
                <Input id="business-name" placeholder="Ex: Açaí dos Sonhos" defaultValue="Açaí dos Sonhos" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" placeholder="Endereço do estabelecimento" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="Telefone de contato" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Email de contato" type="email" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="printer" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuração da Impressora</CardTitle>
              <CardDescription>
                Configure as impressoras para cupons e comandas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Impressora Principal</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-4 flex items-center gap-3 cursor-pointer">
                      <div className="h-4 w-4 rounded-full bg-primary"></div>
                      <span>Bluetooth</span>
                    </div>
                    <div className="border rounded-md p-4 flex items-center gap-3 cursor-pointer bg-muted">
                      <div className="h-4 w-4 rounded-full bg-muted-foreground"></div>
                      <span>USB</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="printer-name">Dispositivo</Label>
                  <div className="border rounded-md p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">POS-58 Printer</p>
                        <p className="text-xs text-muted-foreground">Conectada via Bluetooth</p>
                      </div>
                      <Button variant="secondary" size="sm">Conectar</Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Imprimir automaticamente</Label>
                    <p className="text-sm text-muted-foreground">Imprimir cupom ao finalizar pedido</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Duas vias</Label>
                    <p className="text-sm text-muted-foreground">Imprimir cupom para cliente e cozinha</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Configurações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>
                Controle de acesso ao sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md divide-y">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Administrador</p>
                    <p className="text-xs text-muted-foreground">Acesso completo ao sistema</p>
                  </div>
                  <Button variant="outline" size="sm">Editar</Button>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Operador 1</p>
                    <p className="text-xs text-muted-foreground">Acesso ao caixa</p>
                  </div>
                  <Button variant="outline" size="sm">Editar</Button>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Operador 2</p>
                    <p className="text-xs text-muted-foreground">Acesso ao caixa</p>
                  </div>
                  <Button variant="outline" size="sm">Editar</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Remover Usuário</Button>
              <Button>Adicionar Usuário</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sistema</CardTitle>
              <CardDescription>
                Configurações do sistema e backup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo Escuro</Label>
                  <p className="text-sm text-muted-foreground">Alternar entre tema claro e escuro</p>
                </div>
                <Switch />
              </div>
              
              <div className="border-t pt-4">
                <p className="font-medium mb-2">Backup de Dados</p>
                <p className="text-sm text-muted-foreground mb-4">Faça backup dos dados do sistema</p>
                <div className="flex gap-2">
                  <Button variant="outline">Exportar Dados</Button>
                  <Button variant="outline">Importar Dados</Button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="font-medium mb-2">Versão do Sistema</p>
                <p className="text-sm text-muted-foreground">v1.0.0</p>
                <p className="text-sm text-muted-foreground mt-2">Última atualização: 17/05/2025</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Verificar Atualizações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
