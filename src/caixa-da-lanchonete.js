class CaixaDaLanchonete {
    constructor() {
        this.menu = {
            cafe:      { descricao: "Café",                         valor: 3.0  },
            chantily:  { descricao: "Chantily (extra do Café)",     valor: 1.5  },
            suco:      { descricao: "Suco Natural",                 valor: 6.2  },
            sanduiche: { descricao: "Sanduíche",                    valor: 6.5  },
            queijo:    { descricao: "Queijo (extra do Sanduíche)",  valor: 2.0  },
            salgado:   { descricao: "Salgado",                      valor: 7.25 },
            combo1:    { descricao: "1 Suco e 1 Sanduíche",         valor: 9.5  },
            combo2:    { descricao: "1 Café e 1 Sanduíche",         valor: 7.5  },
        };
    }

    
    
    checkExtra(itens, formaDePagamento){
        function lower(str){
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        }
        let new_menu = {}
        let new_menu_list = []
        Object.keys(this.menu).map((name,index)=>{
            new_menu[name] = this.menu[name]
            new_menu[name].principal = this.menu[name].descricao.includes('extra') ? false : true
            new_menu[name].requisito = this.menu[name].descricao.includes('extra') ? lower(this.menu[name].descricao.match(/extra do (.*?)\)/)[1]) : ''
            new_menu[name].name = name
            new_menu[name].quant = 0
            new_menu_list.push(new_menu[name])
        })
    
        itens.map(e=>{
            let name = e.split(",")[0]
            let quant = e.split(",")[1]|0
            new_menu[name].quant = quant
        })
    
        let list_items_requested = new_menu_list.filter(e=>e.quant>0)
        let list_names_requested = itens.join(",").split(",")
        let test = false
    
        list_items_requested.filter(e=>!e.principal).map(item=>{
            if(!list_names_requested.includes(item.requisito)) test = true
        })

        if(test) return true
    }

    checkItem(item){
        let it = item.split(",")
        let name = item.split(",")[0]
        let quant = item.split(",")[1]
        let isValid = this.menu[name] != undefined
        return {
            name:name,
            quant:(quant|0),
            isValid: isValid
        }
    }

    // calcularValorDaCompra
    calcularValorDaCompra(formaDePagamento, itens){
    
        let sum = 0
        
        if (itens.length <= 0) return "Não há itens no carrinho de compra!";

        if(!this.checkItem(itens[0]).isValid)  return 'Item inválido!'
        
        itens.map(item=>{
            if(this.checkItem(item).isValid){
                let nome = item.split(",")[0]
                let quantidade = item.split(",")[1]
                sum += this.menu[nome].valor * quantidade
            }else{
                return "Item inválido!"
            }
        })

        if(!['dinheiro','credito','debito'].includes(formaDePagamento)) return "Forma de pagamento inválida!"

        if(sum == 0 && formaDePagamento == 'dinheiro') return "Quantidade inválida!"
        
        if (formaDePagamento === "dinheiro") sum *= 0.95;
        if (formaDePagamento === "credito") sum *= 1.03;
    
        //verifica 
        let quants = this.quantities(itens)
        let names_itens = itens.map(e=>e.descricao)
        
        if(this.checkExtra(itens, formaDePagamento))
        return 'Item extra não pode ser pedido sem o principal'
    
        return "R$ "+sum.toFixed(2).replace(".", ",");
    }

    quantities(productsNamesArray){
        let quant_ar = []
        let quant_obj = {}
        productsNamesArray.map(e=> quant_ar.push(e.descricao) )
        quant_ar.map(e=>{
            if(!quant_obj[e]) quant_obj[e] = 1
            else quant_obj[e]++
        })
        return quant_obj
    }
}

export { CaixaDaLanchonete };