import React from 'react'
import { useState, useEffect} from 'react'
import { ethers } from 'ethers'
import { Input, Button  } from "@nextui-org/react";
import { useSigner } from 'wagmi';
import { prepareWriteContract, writeContract } from '@wagmi/core'
import { erc20ABI } from '@wagmi/core'
import { readContract } from '@wagmi/core'
import "./style.css"

 function SellOrderModal({exchangeAddress, show , onCancel}){
    
  const [stAmount, setSTamount] = useState()
  const [ekoAddress, setEkoAddress] = useState()
  const [ekoAmount, setEkoAmount] = useState()
  const [stAddress, setStAddress] = useState()
  const viewFacetAbi = require('../../abi/ViewFacetAbi.json')
  const sellFacetAbi = require('../../abi/SellFacetAbi.json')
  const { data: signer } = useSigner();

  useEffect(() => {
      fetchScoreTokenAddress()
  }, [])

  async function fetchScoreTokenAddress(){
      const data = await readContract({
          address: exchangeAddress,
          abi: viewFacetAbi,
          functionName: 'getScoreTokenAddress',
          
        })
        console.log(data)
        setStAddress(data)
  }

  async function createSellOrder(){
      const st = new ethers.Contract(stAddress, erc20ABI, signer)
      let app = await st.approve("0xE1D5D978FB6162d94DB7aD0572bfFF2EeEc02DC3", stAmount)
      await app.wait()

      const sellFacet = new ethers.Contract("0xE1D5D978FB6162d94DB7aD0572bfFF2EeEc02DC3", sellFacetAbi, signer)
      let order = await sellFacet.createSellScoreTokenOrder(stAmount, ekoAddress, ekoAmount)
      await order.wait()
      
  }

    const submitData = event => {
       event.preventDefault();
      // onSubmit(formData);
          onCancel();
       }
      
    return(

      show ? (
      
         <div className="modal-overlay">

        <div className='modal'>

            <form style={{ border:'white 2px solid', display:'block', paddingTop:'20px'}} onSubmit={submitData}>

            <div className="modal-section">
            <label>Stable Amount</label>
            <div>
            <Input placeholder="Insert st amount" onChange={(e) => setSTamount(e.target.value)} />
            </div>
            </div>

            <div className="modal-section relative block">
            <label>Ekostable Adress</label>
            <div>
            <Input placeholder="Insert requesting ES address" onChange={(e) => setEkoAddress(e.target.value)}/>
            </div>
            </div>


            <div className="modal-section block">
            <label>Requesting Amount</label>
            <div>
            <Input placeholder="Insert requesting amount" onChange={(e) => setEkoAmount(e.target.value)} />
            </div>
            </div>

            <div className='flex mx-auto justify-center mt-10 '>
            <button onClick={() => createSellOrder()} className="create-btn">Create Sell order</button>
            <button onClick={onCancel} className="bg-red-500 cancel-btn"> Cancel </button>
            </div>

        </form>
        </div>
        </div>
        ) : null
  );
 }

export default SellOrderModal