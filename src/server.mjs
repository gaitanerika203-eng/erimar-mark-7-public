import http from 'node:http';
import {capabilities,metrics,plan} from './core.mjs';
const json=(res,code,data)=>{res.writeHead(code,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(data));};
export const handler=(req,res)=>{
 const path=new URL(req.url,'http://localhost').pathname;
 if(req.method==='GET'&&path==='/healthz')return json(res,200,{status:'ok',mode:'plan-only'});
 if(req.method==='GET'&&path==='/api/capabilities')return json(res,200,{capabilities,providers:['Ubuntu','Docker','Vercel','Netlify','Render']});
 if(req.method==='GET'&&path==='/api/telemetry')return json(res,200,metrics());
 if(req.method==='POST'&&path==='/api/plan'){
 let data='',size=0;req.on('data',c=>{size+=c.length;if(size>8192){json(res,413,{error:'too_large'});req.destroy();return;}data+=c;});
 req.on('end',()=>{if(size>8192)return;try{json(res,200,plan(JSON.parse(data)));}catch{json(res,400,{error:'invalid_input'});}});return;
 }
 return json(res,404,{error:'not_found'});
};
if(import.meta.url===`file://${process.argv[1]}`)http.createServer(handler).listen(Number(process.env.PORT||3000),'0.0.0.0');
