import React, { Component } from 'react';
import { Input } from "react-materialize";
import AuthUserContext from '../AuthUserContext';
import PasswordChangeForm from './PasswordChange';
import API from "../../utils/API";
import withAuthorization from '../withAuthorization';
import * as f from '../../constants/functions';

const AccountPage = () => (
	<AuthUserContext.Consumer>
		{authUser =>
			<div>
				<Profile authUser={authUser} />
			</div>
		}
	</AuthUserContext.Consumer>
)

class Profile extends Component {
	constructor(props){
		super(props);
		this.state = {
			account: {},
			products: null,
			userId: this.props.authUser.uid,
		};

		this.updateProductList = this.updateProductList.bind(this);
  }

	componentDidMount(){
		this.pageLoadData();
	};

	pageLoadData = () => {
		API.getAccount(this.state.userId)
			.then(res => {
				this.setState({
					account: res.data[0],
					products: res.data[0].products,
				});
			})
			.catch(err => console.log(err));
	};

	updateProductList = (newList) => {
		console.log('inside update product list');
		this.setState({ products: newList });
	}

	handleProductDelete = (id) => {
		console.log('Deleting product: ',id);
		// TODO: remove product image from google cloud
		API.deleteProduct(id)
			.then(res => {
				console.log(`Successfully deleted Product: ${id}`);
				API.getProductsForUser(this.state.userId)
					.then(results=> {
						this.setState({ products: results.data });
					})
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
	};

  render() {
    return (
			<div>
				<div className="row">
					<div className="col s6">
						<h4>Account: {this.state.account.name}</h4>
						<h5>Email: {this.props.authUser.email}</h5>
					</div>
					<div className="col s6">
						<h4>Products You Are Selling</h4>
					</div>
				</div>
				<div className="row">
					<div className="col s6">
						<NewProduct
							userId={this.props.authUser.uid}
							updateProductList={this.updateProductList}
						/>
						<PasswordChangeForm />
					</div>
					<div className="col s6">
						<UserProductsList
							products={this.state.products}
							handleProductDelete={this.handleProductDelete}
						/>
					</div>
				</div>
			</div>
    );
  }
}

const INITIAL_PRODUCT_STATE = {
	title: '',
	description: '',
	category: 'General',
	price: '',
	quantity: '',
	img_local: '',
	img_cloud: '',
}

class NewProduct extends Component {
	constructor(props){
		super(props);
		this.state = {
			...INITIAL_PRODUCT_STATE,
			userId: this.props.userId,
		};
	};

	// Handle Image Upload
	handlePicUpload = event => {
		const data = new FormData(event.target);

		API.uploadPic(data)
		.then(res => {
			this.setState({
				img_local: res.data.local_url,
				img_cloud: res.data.cloud_url,
			});
		})
		.catch(err => console.log(err));

		event.preventDefault();
	};

	handlePictureChange = (event) => {
		const curFiles = event.target.files;
		const fileTypes = ['image/jpeg', 'image/jpg',
		'image/png', 'image/webp', 'image/gif'];
		const validFileType = (file) => {
			for (var i = 0; i < fileTypes.length; i++) {
				if(file.type === fileTypes[i]) {
					return true;
				}
			}
			return false;
		}
		if(validFileType(curFiles[0])) {
			const imgPath = window.URL.createObjectURL(curFiles[0]);
			this.setState({img_local: imgPath});
			const imgForm = document.querySelector('#image');
			imgForm.querySelector('input[type="submit"]').click();
		}
	}

	// Handle Input Change Events
	handleInputChange = event => {
		const {name, value} = event.target;
		this.setState({ [name]: value });
	};

	// Handle the creation of a new product
	handleFormSubmit = event => {
		event.preventDefault();
		const price = this.state.price;
		const old_price = Math.floor(Math.random() * ((price * .8) - (price * .1) + (price * .1)));

		API.createProduct({
				...this.state,
				old_price: old_price
			})
			.then(res => {
				this.setState({ ...INITIAL_PRODUCT_STATE });
				API.getProductsForUser(this.props.userId)
					.then(results => this.props.updateProductList(results.data))
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err));


	};

	render() {

		const {
			title,
			description,
			category,
			price,
			quantity,
			img_local
		} = this.state;

		const isInvalid = (
			title === '' ||
			price === '' ||
			price <= 0 ||
			quantity === ''
		);

		return (
			<div className="row profile">
				<h5>Add a product</h5>
				<form id="image"	className="row"	action="api/uploads/" method="post"
					encType="multipart/form-data"	onSubmit={this.handlePicUpload}>
					<label htmlFor="imageUpload">
						<div className="preview">
							<img
								id="preview-img"
								src={img_local || "https://storage.googleapis.com/surplus-6507a.appspot.com/assets/placeholder.png"}
								alt={title}
							/>
							<a className="btn-floating btn-large waves-effect waves-light red">
								<i className="material-icons">add</i>
							</a>
						</div>
					</label>
					<input id="imageUpload" type="file" name="imageUpload"
						onChange={this.handlePictureChange} accept=".jpg, .jpeg, .png, .svg"
						style={{opacity: 0}}
					/>
					<input type="submit" value="Load Image" style={{opacity: 0}} />
				</form>
				<form className="row">
					<Input s={12}	type="text" onChange={this.handleInputChange}
						label="Title (required)" value={title} name="title"
					/>
					<Input s={12} type="textarea" onChange={this.handleInputChange}
						label="Description"	value={description}	name="description"
					/>
					<Input s={12} type='select' label="Cateogry" name="category"
						value={category}
						onChange={this.handleInputChange} defaultValue="General">
						<option value='General'>General</option>
						<option value='Furniture'>Furniture</option>
						<option value='Electronics'>Electronics</option>
						<option value='Apparel'>Apparel</option>
						<option value='Office'>Office Supplies</option>
					</Input>
					<Input s={12} type="number" step="0.01" min="0" onChange={this.handleInputChange}
						label="Price per unit" value={price} name="price"
					/>
					<Input s={12} type="number" onChange={this.handleInputChange}
						label="Quantity" value={quantity} name="quantity"
					/>
					<button disabled={isInvalid} className="btn center-align indigo darker-4" onClick={this.handleFormSubmit}>
						Submit
					</button>
				</form>
			</div>
		);
	};
};

const UserProduct = (props) => {
	const {
		title,
		quantity,
		img_cloud
	} = props.product;

	const rating = 4;
	const price = props.product.price.toFixed(2);

	return (
		<div className="item-container">
			<div className="row img-holder">
				<img className="product-img" src={img_cloud ||
				"https://storage.googleapis.com/surplus-6507a.appspot.com/assets/placeholder.png"}
					alt={title} />
			</div>
			<div className="row">
				<div>
					<span className="product-title">{title}</span>
				</div>
			</div>
			<div className="row">
				<div className="price">Price/unit: ${f.formatMoney(price,2,'.',',')}</div>
				<div>Stock: <span className="quantity">{quantity}</span></div>
				<div className={`rating stars-${rating}`} title="User Rating"></div>
			</div>
			<div className="close" title="Remove Product" onClick={() => props.handleProductDelete(props.product._id)}>
				<i className="fas fa-window-close fa-2x"></i>
			</div>
		</div>
	);
};

const UserProductsList = props => (
	<div className="row productslist">
		{!props.products
			? <i className="fas fa-spinner fa-spin fa-5x"></i>
			: props.products.length
				? props.products.map(product =>
					<UserProduct product={product} key={product._id}
						handleProductDelete={props.handleProductDelete} />)
				: `You are not currently selling any products.`
		}
	</div>
);

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(AccountPage);
