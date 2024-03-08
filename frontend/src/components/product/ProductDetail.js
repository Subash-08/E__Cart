import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import {  getProduct } from "../../actions/productActions"
import Loader from '../layouts/Loader';
import { Carousel } from 'react-bootstrap';
import MetaData from "../layouts/MetaData";
import { addCartItem } from "../../actions/cartActions";
import { clearError, clearProduct} from '../../slices/productSlice';
import { toast } from "react-toastify";


export default function ProductDetail () {
    const { loading, product = {}, error} = useSelector((state)=>state.productState);
    // const { user } = useSelector(state => state.authState);
    const dispatch = useDispatch();
    const { id } = useParams()
    const [quantity, setQuantity] = useState(1);

    const increaseQty = () => {
        const count = document.querySelector('.count')
        if(product.stock === 0 ||  count.valueAsNumber >= product.stock) return;
        const qty = count.valueAsNumber + 1;
        setQuantity(qty);
    }
    const decreaseQty = () => {
        const count = document.querySelector('.count')
        if(count.valueAsNumber === 1 ) return;
        const qty = count.valueAsNumber - 1;
        setQuantity(qty);
    }

    

    useEffect(()=>{
       
        if(error)  {
            toast(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'error',
                onOpen: ()=> { dispatch(clearError()) }
            })
            return
        }
        if(!product._id ) {
            dispatch(getProduct(id))
        }

        return () => {
            dispatch(clearProduct())
        }
        

    },[dispatch,id , error])



    return (
        <Fragment>
            {loading? <Loader/>:
            <Fragment>
                <MetaData title={product.name} />
                <div className="row f-flex justify-content-around">
                    <div className="col-12 col-lg-5 img-fluid" id="product_image">
                        <Carousel pause="hover">
                            {product.images && product.images.length > 0 && product.images.map(image =>
                                <Carousel.Item key={image._id}>
                                    <img className="d-block w-100"  src={image.image} alt={product.name} height="500" width="500" />
                                </Carousel.Item>
                            )}
                        </Carousel>
                    </div>

                    <div className="col-12 col-lg-5 mt-5">
                    <h3>{product.name}</h3>
                    <p id="product_id">Product # {product._id}</p>

                    <hr/>

                    <div className="rating-outer">
                        <div className="rating-inner" style={{width: `${product.ratings/ 5 * 100}%` }}></div>
                    </div>
                    <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>

                    <hr/>

                    <p id="product_price"><i class="fa fa-inr"></i>{product.price}</p>
                    <div className="stockCounter d-inline">
                        <span className="btn btn-danger minus" onClick={decreaseQty} >-</span>

                        <input type="number" className="form-control count d-inline" value={quantity} readOnly />

                        <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
                    </div>
                    <button type="button" id="cart_btn" 
                     disabled={product.stock===0?true:false} 
                     onClick={()=>{
                        dispatch(addCartItem(product._id, quantity))
                        toast('Cart Item Added!',{
                            type: 'success',
                            position: toast.POSITION.BOTTOM_CENTER
                        })
                    }}
                     className="btn btn-primary d-inline ml-4"
                     >Add to Cart</button>

                    <hr/>

                    <p>Status: <span className={product.stock > 0 ?'greenColor':'redColor'} id="stock_status">{ product.stock > 0 ?'In Stock':'Out of Stock'}</span></p>

                    <hr/>

                    <h4 className="mt-2">Description:</h4>
                    <p>{product.description}</p>
                    <hr/>
                    <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>
                   
                            
                </div>

                </div>

                
            </Fragment>}
        </Fragment>
    )
}